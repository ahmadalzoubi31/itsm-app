"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Code2 } from "lucide-react";
import { toast } from "sonner";

interface JsonSchemaEditorProps {
  value: any;
  onChange: (value: any) => void;
}

const JsonSchemaEditor = ({ value, onChange }: JsonSchemaEditorProps) => {
  // HOOKS
  // Custom Hooks
  // React Hooks
  const [jsonText, setJsonText] = useState(
    JSON.stringify(value || getDefaultSchema(), null, 2)
  );
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // EFFECTS
  // useEffect(() => {}, []);

  // HELPERS
  // const helperFn = () => {};

  // EVENT HANDLERS
  const handleChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setError(null);
      setIsValid(true);
      onChange(parsed);
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      toast.error("Invalid JSON - cannot format");
    }
  };

  const insertExample = () => {
    const example = getExampleSchema();
    const formatted = JSON.stringify(example, null, 2);
    setJsonText(formatted);
    handleChange(formatted);
  };

  // EARLY RETURNS
  // if (!data) return <div>Loading...</div>;

  // RENDER LOGIC
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          <span className="text-sm font-medium">JSON Schema Editor</span>
          {isValid ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={insertExample}>
            Insert Example
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleFormat}>
            Format JSON
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Invalid JSON: {error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        value={jsonText}
        onChange={(e) => handleChange(e.target.value)}
        className="font-mono text-sm min-h-[400px]"
        placeholder="Enter JSON Schema..."
      />

      <div className="text-xs text-muted-foreground">
        Define your form fields using JSON Schema. Include properties, types, and validation rules.
      </div>
    </div>
  );
};

export default JsonSchemaEditor;

function getDefaultSchema() {
  return {
    type: "object",
    properties: {},
    required: [],
  };
}

function getExampleSchema() {
  return {
    type: "object",
    properties: {
      requestType: {
        type: "string",
        title: "Request Type",
        enum: ["New Equipment", "Software Access", "Password Reset"],
        description: "Select the type of request",
      },
      urgency: {
        type: "string",
        title: "Urgency",
        enum: ["Low", "Medium", "High", "Critical"],
        description: "How urgent is this request?",
      },
      details: {
        type: "string",
        title: "Details",
        description: "Provide additional details about your request",
        maxLength: 500,
      },
      requiredByDate: {
        type: "string",
        title: "Required By Date",
        format: "date",
      },
    },
    required: ["requestType", "urgency", "details"],
  };
}

