"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface DynamicFormRendererProps {
  jsonSchema: any;
  defaults?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

/**
 * Convert JSON Schema to Zod schema for validation
 */
function jsonSchemaToZod(jsonSchema: any): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};
  const properties = jsonSchema.properties || {};
  const required = jsonSchema.required || [];

  Object.keys(properties).forEach((key) => {
    const prop = properties[key];
    let zodType: z.ZodTypeAny;

    switch (prop.type) {
      case "string":
        zodType = z.string();
        if (prop.minLength)
          zodType = (zodType as z.ZodString).min(prop.minLength);
        if (prop.maxLength)
          zodType = (zodType as z.ZodString).max(prop.maxLength);
        if (prop.pattern)
          zodType = (zodType as z.ZodString).regex(new RegExp(prop.pattern));
        if (prop.format === "email") zodType = (zodType as z.ZodString).email();
        break;
      case "number":
      case "integer":
        zodType = z.number();
        if (prop.minimum !== undefined)
          zodType = (zodType as z.ZodNumber).min(prop.minimum);
        if (prop.maximum !== undefined)
          zodType = (zodType as z.ZodNumber).max(prop.maximum);
        break;
      case "boolean":
        zodType = z.boolean();
        break;
      case "array":
        zodType = z.array(z.any());
        break;
      default:
        zodType = z.any();
    }

    // Make optional if not required
    if (!required.includes(key)) {
      zodType = zodType.optional();
    }

    shape[key] = zodType;
  });

  return z.object(shape);
}

export function DynamicFormRenderer({
  jsonSchema,
  defaults = {},
  onSubmit,
  isSubmitting = false,
}: DynamicFormRendererProps) {
  const properties = jsonSchema.properties || {};
  const required = jsonSchema.required || [];

  // Build default values
  const defaultValues: Record<string, any> = {};
  Object.keys(properties).forEach((key) => {
    const prop = properties[key];
    const isRequired = required.includes(key);

    // Use provided defaults, then schema default, then appropriate empty value
    if (defaults[key] !== undefined) {
      defaultValues[key] = defaults[key];
    } else if (prop.default !== undefined) {
      defaultValues[key] = prop.default;
    } else {
      // Set appropriate empty value based on type
      switch (prop.type) {
        case "number":
        case "integer":
          defaultValues[key] = isRequired ? 0 : undefined;
          break;
        case "boolean":
          defaultValues[key] = false;
          break;
        case "array":
          defaultValues[key] = [];
          break;
        default:
          defaultValues[key] = isRequired ? "" : undefined;
      }
    }
  });

  const zodSchema = jsonSchemaToZod(jsonSchema);
  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [jsonSchema]);

  /**
   * Clean form data before submission:
   * - Remove empty strings, null, undefined for optional fields
   * - Ensure proper types (numbers as numbers, not strings)
   * - Handle NaN values
   */
  const cleanFormData = (data: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};

    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      const value = data[key];
      const isRequired = required.includes(key);

      // Skip empty values for optional fields
      if (
        !isRequired &&
        (value === "" || value === null || value === undefined)
      ) {
        return;
      }

      // Handle date format - ensure ISO 8601 format (YYYY-MM-DD)
      if (prop.format === "date" && value) {
        if (typeof value === "string") {
          // If already in YYYY-MM-DD format, use as-is
          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            cleaned[key] = value;
          } else {
            // Try to convert to ISO format
            try {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                cleaned[key] = date.toISOString().split("T")[0];
              } else {
                // Invalid date - include as-is so backend validation catches it
                cleaned[key] = value;
              }
            } catch (e) {
              cleaned[key] = value;
            }
          }
        } else {
          cleaned[key] = value;
        }
      }
      // Handle number types
      else if (prop.type === "number" || prop.type === "integer") {
        // Skip NaN values for optional fields
        if (
          !isRequired &&
          (value === undefined || value === null || isNaN(value))
        ) {
          return;
        }
        // Ensure it's a number
        if (typeof value === "string" && value !== "") {
          const numValue =
            prop.type === "integer" ? parseInt(value, 10) : parseFloat(value);
          if (!isNaN(numValue)) {
            cleaned[key] = numValue;
          }
        } else if (typeof value === "number" && !isNaN(value)) {
          cleaned[key] = prop.type === "integer" ? Math.floor(value) : value;
        } else if (isRequired) {
          // Required number field with invalid value - include it so backend validation catches it
          cleaned[key] = value;
        }
      } else {
        // For other types, include the value as-is
        cleaned[key] = value;
      }
    });

    return cleaned;
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    const cleanedData = cleanFormData(data);

    onSubmit(cleanedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {Object.keys(properties).map((key) => {
          const prop = properties[key];
          const isRequired = required.includes(key);

          return (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {prop.title || key}
                    {isRequired && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>{renderField(prop, field, key)}</FormControl>
                  {prop.description && (
                    <FormDescription>{prop.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <div className="flex justify-end gap-4 pt-4">
          <Button size="sm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function renderField(prop: any, field: any, key: string) {
  // Handle enum (select dropdown)
  if (prop.enum) {
    return (
      <Select onValueChange={field.onChange} value={field.value ?? ""}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${prop.title || key}`} />
        </SelectTrigger>
        <SelectContent>
          {prop.enum.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  switch (prop.type) {
    case "string":
      // Use date input for date format
      if (prop.format === "date") {
        // Convert date value to YYYY-MM-DD format for HTML5 date input
        const formatDateForInput = (value: any): string => {
          if (!value) return "";
          if (typeof value === "string") {
            // If already in YYYY-MM-DD format, use as-is
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
              return value;
            }
            // Try to parse other date formats
            try {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                return date.toISOString().split("T")[0];
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
          return "";
        };

        return (
          <Input
            type="date"
            {...field}
            value={formatDateForInput(field.value)}
            onChange={(e) => {
              // HTML5 date input returns YYYY-MM-DD format (ISO 8601)
              field.onChange(e.target.value || undefined);
            }}
          />
        );
      }
      // Use textarea for long text
      if (prop.format === "textarea" || prop.maxLength > 200) {
        return (
          <Textarea
            placeholder={prop.examples?.[0] || ""}
            {...field}
            value={field.value ?? ""}
            rows={4}
          />
        );
      }
      return (
        <Input
          type={prop.format === "email" ? "email" : "text"}
          placeholder={prop.examples?.[0] || ""}
          {...field}
          value={field.value ?? ""}
        />
      );

    case "number":
    case "integer":
      return (
        <Input
          type="number"
          placeholder={prop.examples?.[0] || ""}
          {...field}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || value === null) {
              field.onChange(undefined);
            } else {
              const numValue =
                prop.type === "integer"
                  ? parseInt(value, 10)
                  : parseFloat(value);
              field.onChange(isNaN(numValue) ? undefined : numValue);
            }
          }}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          <span className="text-sm text-muted-foreground">
            {prop.description || "Enable this option"}
          </span>
        </div>
      );

    default:
      return (
        <Input placeholder="Enter value" {...field} value={field.value ?? ""} />
      );
  }
}
