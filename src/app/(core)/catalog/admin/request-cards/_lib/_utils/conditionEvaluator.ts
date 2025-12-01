/**
 * Condition Evaluator Utility
 *
 * Evaluates conditional logic for form fields to determine visibility
 * based on other field values.
 */

export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "isEmpty"
  | "isNotEmpty";

export interface Condition {
  field: string; // Key of the field to check
  operator: ConditionOperator;
  value?: any; // Value to compare against (not needed for isEmpty/isNotEmpty)
}

export interface ConditionalLogic {
  conditions: Condition[];
  logicOperator: "AND" | "OR"; // How to combine multiple conditions
}

/**
 * Evaluate a single condition
 */
export function evaluateCondition(
  condition: Condition,
  formValues: Record<string, any>
): boolean {
  const fieldValue = formValues[condition.field];

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "notEquals":
      return fieldValue !== condition.value;
    case "contains":
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      if (typeof fieldValue === "string") {
        return fieldValue.includes(String(condition.value));
      }
      return false;
    case "isEmpty":
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    case "isNotEmpty":
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== "" &&
        !(Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    default:
      return true;
  }
}

/**
 * Evaluate all conditions for a field
 */
export function evaluateConditionalLogic(
  conditionalLogic: ConditionalLogic | undefined,
  formValues: Record<string, any>
): boolean {
  if (!conditionalLogic || conditionalLogic.conditions.length === 0) {
    return true; // No conditions means always visible
  }

  const results = conditionalLogic.conditions.map((condition) =>
    evaluateCondition(condition, formValues)
  );

  return conditionalLogic.logicOperator === "AND"
    ? results.every((r) => r)
    : results.some((r) => r);
}

/**
 * Get all visible field keys based on current form values
 * Handles cascading conditions where field A affects B, and B affects C
 */
export function getVisibleFields(
  fields: Array<{ key: string; conditionalLogic?: ConditionalLogic }>,
  formValues: Record<string, any>
): Set<string> {
  const visibleFields = new Set<string>();

  // Iteratively evaluate conditions to handle cascading dependencies
  let changed = true;
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    for (const field of fields) {
      const wasVisible = visibleFields.has(field.key);
      const isVisible = evaluateConditionalLogic(
        field.conditionalLogic,
        formValues
      );

      if (isVisible && !wasVisible) {
        visibleFields.add(field.key);
        changed = true;
      } else if (!isVisible && wasVisible) {
        visibleFields.delete(field.key);
        changed = true;
      }
    }
  }

  return visibleFields;
}

/**
 * Validate that there are no circular dependencies
 */
export function validateNoDependencyCycles(
  fields: Array<{ key: string; conditionalLogic?: ConditionalLogic }>
): { valid: boolean; error?: string; cycle?: string[] } {
  // Build dependency graph
  const graph = new Map<string, Set<string>>();

  for (const field of fields) {
    if (field.conditionalLogic) {
      const dependencies = new Set(
        field.conditionalLogic.conditions.map((c) => c.field)
      );
      graph.set(field.key, dependencies);
    }
  }

  // Check for cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function hasCycle(node: string): boolean {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = graph.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart);
        return true;
      }
    }

    recursionStack.delete(node);
    path.pop();
    return false;
  }

  for (const field of fields) {
    if (!visited.has(field.key)) {
      if (hasCycle(field.key)) {
        return {
          valid: false,
          error: `Circular dependency detected involving field: ${field.key}`,
          cycle: [...path],
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Get all fields that a given field depends on (direct and indirect)
 */
export function getFieldDependencies(
  fieldKey: string,
  fields: Array<{ key: string; conditionalLogic?: ConditionalLogic }>
): string[] {
  const field = fields.find((f) => f.key === fieldKey);
  if (!field?.conditionalLogic) {
    return [];
  }

  const directDeps = field.conditionalLogic.conditions.map((c) => c.field);
  const allDeps = new Set(directDeps);

  // Recursively get dependencies of dependencies
  for (const dep of directDeps) {
    const indirectDeps = getFieldDependencies(dep, fields);
    indirectDeps.forEach((d) => allDeps.add(d));
  }

  return Array.from(allDeps);
}

/**
 * Get all fields that depend on a given field
 */
export function getFieldDependents(
  fieldKey: string,
  fields: Array<{ key: string; conditionalLogic?: ConditionalLogic }>
): string[] {
  return fields
    .filter((field) =>
      field.conditionalLogic?.conditions.some((c) => c.field === fieldKey)
    )
    .map((f) => f.key);
}
