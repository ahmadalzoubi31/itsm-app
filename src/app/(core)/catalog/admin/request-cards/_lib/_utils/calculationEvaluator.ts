import { create, all } from "mathjs";

// Create a mathjs instance
const math = create(all);

export type CalculationType = "arithmetic" | "concatenation";

export interface FieldCalculation {
  type: CalculationType;
  expression: string; // e.g., "quantity * price" or "firstName + ' ' + lastName"
  dependencies: string[]; // List of field keys this calculation depends on
}

/**
 * Validates a calculation expression
 * @param expression The expression to validate
 * @param availableFields List of available field keys
 * @returns Object containing validity and error message if any
 */
export const validateCalculation = (
  expression: string,
  availableFields: string[]
): { valid: boolean; error?: string } => {
  try {
    // Parse the expression to check for syntax errors
    const node = math.parse(expression);

    // Check if all symbols in the expression exist in availableFields
    const symbols = node.filter((n: any) => n.isSymbolNode);
    const invalidSymbols = symbols
      .map((n: any) => n.name)
      .filter((name: string) => !availableFields.includes(name));

    if (invalidSymbols.length > 0) {
      return {
        valid: false,
        error: `Unknown fields: ${invalidSymbols.join(", ")}`,
      };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
};

/**
 * Evaluates a calculation expression against a data object
 * @param calculation The calculation configuration
 * @param data The form data object
 * @returns The calculated result
 */
export const evaluateCalculation = (
  calculation: FieldCalculation,
  data: Record<string, any>
): string | number | null => {
  try {
    if (!calculation.expression) return null;

    // Create a scope with only the dependent values
    // This prevents access to global variables and ensures we only use what's allowed
    const scope: Record<string, any> = {};

    // Populate scope with data, defaulting to 0 for numbers and "" for strings if missing
    calculation.dependencies.forEach((dep) => {
      const value = data[dep];
      // simplistic type inference for default values
      // In a real scenario, we might want to know the type of the source field
      if (value === undefined || value === null) {
        scope[dep] = 0; // Default to 0 to avoid errors in math
      } else {
        // If it looks like a number, parse it
        if (typeof value === "string" && !isNaN(parseFloat(value))) {
          scope[dep] = parseFloat(value);
        } else {
          scope[dep] = value;
        }
      }
    });

    if (calculation.type === "arithmetic") {
      const result = math.evaluate(calculation.expression, scope);
      // Ensure we return a number or null
      return typeof result === "number" ? result : null;
    } else if (calculation.type === "concatenation") {
      // For concatenation, we might want a simpler template engine or just use JS template literals if safe
      // But since we want to support basic "Field A + Field B", mathjs might not be the best for string ops unless we configure it.
      // For now, let's assume simple string concatenation via a custom parser or just JS evaluation (risky).
      // A safer approach for concatenation is to replace {{key}} with values.

      // Let's implement a simple {{key}} replacer for concatenation type
      let result = calculation.expression;
      calculation.dependencies.forEach((dep) => {
        const val =
          data[dep] !== undefined && data[dep] !== null ? data[dep] : "";
        result = result.replace(new RegExp(`{{${dep}}}`, "g"), String(val));
      });
      return result;
    }

    return null;
  } catch (error) {
    console.warn("Calculation error:", error);
    return null;
  }
};

/**
 * Extracts dependencies from an expression
 * @param expression The expression string
 * @returns Array of field keys
 */
export const extractDependencies = (expression: string): string[] => {
  try {
    const node = math.parse(expression);
    const symbols = node.filter((n: any) => n.isSymbolNode);
    return [...new Set(symbols.map((n: any) => n.name))]; // Unique symbols
  } catch (e) {
    return [];
  }
};
