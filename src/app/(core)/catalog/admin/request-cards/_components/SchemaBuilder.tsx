"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Code2, Wand2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import JsonSchemaEditor from "./JsonSchemaEditor";
import ConditionBuilder from "./ConditionBuilder";
import { toast } from "sonner";
import {
  ConditionalLogic,
  validateNoDependencyCycles,
  getFieldDependencies,
} from "@/app/(core)/catalog/admin/request-cards/_lib/_utils/conditionEvaluator";

interface DatabaseDataSource {
  entity: string; // e.g., "users", "groups", "businessLines"
  displayField: string; // e.g., "name", "email"
  valueField: string; // e.g., "id"
  filters?: Record<string, any>; // Optional filters like { active: true }
}

interface SchemaField {
  id: string;
  key: string;
  title: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "select"
    | "textarea"
    | "checkbox"
    | "database_dropdown";
  description?: string;
  required: boolean;
  enum?: string[];
  dataSource?: DatabaseDataSource;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  format?: string;
  default?: string | number | boolean;
  conditionalLogic?: ConditionalLogic;
}

interface SchemaBuilderProps {
  value: any;
  onChange: (value: any) => void;
}

const SchemaBuilder = ({ value, onChange }: SchemaBuilderProps) => {
  // HOOKS
  // Custom Hooks
  // React Hooks
  const [mode, setMode] = useState<"visual" | "json">("visual");
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [editingField, setEditingField] = useState<SchemaField | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // EFFECTS
  useEffect(() => {
    if (value && value.properties) {
      const fieldArray: SchemaField[] = Object.entries(value.properties).map(
        ([key, prop]: [string, any]) => ({
          id: key,
          key,
          title: prop.title || key,
          type: getFieldType(prop),
          description: prop.description || "",
          required: value.required?.includes(key) || false,
          enum: prop.enum,
          dataSource: prop.dataSource,
          minLength: prop.minLength,
          maxLength: prop.maxLength,
          minimum: prop.minimum,
          maximum: prop.maximum,
          format: prop.format,
          default: prop.default,
          conditionalLogic: prop.conditionalLogic,
        })
      );
      setFields(fieldArray);
    } else {
      setFields([]);
    }
  }, [value]);

  // HELPERS
  const updateSchema = (updatedFields: SchemaField[]) => {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    updatedFields.forEach((field) => {
      const prop: any = {
        type: getJsonSchemaType(field.type),
        title: field.title,
      };

      if (field.description) {
        prop.description = field.description;
      }

      if (field.type === "select" && field.enum && field.enum.length > 0) {
        prop.enum = field.enum.filter((e) => e.trim() !== "");
      }

      if (field.type === "date") {
        prop.format = "date";
      }

      if (field.type === "textarea") {
        prop.format = "textarea";
      }

      if (field.type === "checkbox") {
        prop.format = "checkbox";
      }

      if (field.type === "database_dropdown" && field.dataSource) {
        prop.format = "database_dropdown";
        prop.dataSource = field.dataSource;
      }

      if (field.minLength !== undefined && field.minLength > 0) {
        prop.minLength = field.minLength;
      }

      if (field.maxLength !== undefined && field.maxLength > 0) {
        prop.maxLength = field.maxLength;
      }

      if (field.minimum !== undefined) {
        prop.minimum = field.minimum;
      }

      if (field.maximum !== undefined) {
        prop.maximum = field.maximum;
      }

      if (field.default !== undefined && field.default !== "") {
        prop.default = field.default;
      }

      if (field.conditionalLogic) {
        prop.conditionalLogic = field.conditionalLogic;
      }

      properties[field.key] = prop;

      if (field.required) {
        required.push(field.key);
      }
    });

    const newSchema = {
      type: "object",
      properties,
      required,
    };

    onChange(newSchema);
  };

  // EVENT HANDLERS
  const addField = () => {
    const newField: SchemaField = {
      id: "",
      key: "",
      title: "",
      type: "string",
      description: "",
      required: false,
    };
    setEditingField(newField);
    setIsDialogOpen(true);
  };

  const editField = (field: SchemaField) => {
    setEditingField({ ...field });
    setIsDialogOpen(true);
  };

  const deleteField = (id: string) => {
    const updatedFields = fields.filter((f) => f.id !== id);
    setFields(updatedFields);
    updateSchema(updatedFields);
  };

  const saveField = (field: SchemaField) => {
    if (!field.key || !field.title) {
      toast.error("Key and Title are required");
      return;
    }

    // Validate database dropdown configuration
    if (field.type === "database_dropdown") {
      if (
        !field.dataSource?.entity ||
        !field.dataSource?.displayField ||
        !field.dataSource?.valueField
      ) {
        toast.error(
          "Database dropdown requires entity, display field, and value field"
        );
        return;
      }
    }

    // Check for duplicate keys
    const existingField = fields.find(
      (f) => f.key === field.key && f.id !== field.id
    );
    if (existingField) {
      toast.error("A field with this key already exists");
      return;
    }

    // Determine if this is an edit or add operation
    const isEdit =
      editingField?.id && fields.some((f) => f.id === editingField.id);
    const updatedFields = isEdit
      ? fields.map((f) => (f.id === editingField.id ? field : f))
      : [...fields, field];

    // Validate conditional logic
    if (field.conditionalLogic) {
      // Check that all referenced fields exist
      for (const condition of field.conditionalLogic.conditions) {
        const referencedField = updatedFields.find(
          (f) => f.key === condition.field
        );
        if (!referencedField) {
          toast.error(`Referenced field "${condition.field}" does not exist`);
          return;
        }
      }

      // Check for circular dependencies
      const validation = validateNoDependencyCycles(updatedFields);
      if (!validation.valid) {
        toast.error(validation.error || "Circular dependency detected");
        return;
      }
    }

    setFields(updatedFields);
    updateSchema(updatedFields);
    setIsDialogOpen(false);
    setEditingField(null);
  };

  const getFieldTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      string: "Text",
      number: "Number",
      boolean: "Yes/No",
      checkbox: "Checkbox",
      date: "Date",
      select: "Dropdown",
      database_dropdown: "Database Dropdown",
      textarea: "Long Text",
    };
    return labels[type] || type;
  };

  // EARLY RETURNS
  // if (!data) return <div>Loading...</div>;

  // RENDER LOGIC
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === "visual" ? (
            <Wand2 className="h-4 w-4" />
          ) : (
            <Code2 className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {mode === "visual" ? "Visual Builder" : "JSON Editor"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            type="button"
            variant={mode === "visual" ? "default" : "outline"}
            onClick={() => setMode("visual")}
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Visual
          </Button>
          <Button
            size="sm"
            type="button"
            variant={mode === "json" ? "default" : "outline"}
            onClick={() => setMode("json")}
          >
            <Code2 className="h-4 w-4 mr-1" />
            JSON
          </Button>
        </div>
      </div>

      {mode === "visual" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Build your form visually by adding fields. Each field will appear
              in the request form.
            </p>
            <Button type="button" onClick={addField} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </div>

          {fields.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  No fields added yet
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Click "Add Field" to start building your form
                </p>
                <Button
                  size="sm"
                  type="button"
                  onClick={addField}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Field
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {fields.map((field) => (
                <Card key={field.id} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{field.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ({getFieldTypeLabel(field.type)})
                          </span>
                          {field.required && (
                            <span className="text-xs text-destructive">*</span>
                          )}
                          {field.conditionalLogic && (
                            <Badge variant="outline" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Conditional
                            </Badge>
                          )}
                        </div>
                        {field.description && (
                          <p className="text-sm text-muted-foreground ml-6">
                            {field.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground ml-6">
                          Key: <code className="text-xs">{field.key}</code>
                          {field.type === "database_dropdown" &&
                            field.dataSource && (
                              <span className="ml-2 text-muted-foreground">
                                • {field.dataSource.entity} (
                                {field.dataSource.displayField})
                              </span>
                            )}
                        </p>
                        {field.conditionalLogic && (
                          <p className="text-xs text-muted-foreground ml-6">
                            <span className="text-blue-600 dark:text-blue-400">
                              Depends on:{" "}
                              {field.conditionalLogic.conditions
                                .map((c) => {
                                  const depField = fields.find(
                                    (f) => f.key === c.field
                                  );
                                  return depField?.title || c.field;
                                })
                                .join(", ")}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => editField(field)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => deleteField(field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <JsonSchemaEditor value={value} onChange={onChange} />
      )}

      <FieldDialog
        field={editingField}
        existingFields={fields}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingField(null);
        }}
        onSave={saveField}
      />
    </div>
  );
};

export default SchemaBuilder;

interface FieldDialogProps {
  field: SchemaField | null;
  existingFields: SchemaField[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: SchemaField) => void;
}

const FieldDialog = ({
  field,
  existingFields,
  isOpen,
  onClose,
  onSave,
}: FieldDialogProps) => {
  // HOOKS
  // Custom Hooks
  // React Hooks
  const [formData, setFormData] = useState<SchemaField>({
    id: "",
    key: "",
    title: "",
    type: "string",
    description: "",
    required: false,
  });
  const [keyManuallyEdited, setKeyManuallyEdited] = useState(false);

  // EFFECTS
  useEffect(() => {
    if (field) {
      setFormData(field);
      setKeyManuallyEdited(!!field.key);
    } else {
      setFormData({
        id: "",
        key: "",
        title: "",
        type: "string",
        description: "",
        required: false,
      });
      setKeyManuallyEdited(false);
    }
  }, [field]);

  // HELPERS
  const generateKeyFromTitle = (
    title: string,
    currentFieldId?: string
  ): string => {
    let baseKey =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
        .replace(/_+/g, "_") || // Replace multiple underscores with single
      "field";

    // Ensure uniqueness
    let key = baseKey;
    let counter = 1;
    while (
      existingFields.some((f) => f.key === key && f.id !== currentFieldId)
    ) {
      key = `${baseKey}_${counter}`;
      counter++;
    }

    return key;
  };

  // EVENT HANDLERS
  const handleSave = () => {
    if (!formData.id) {
      formData.id = `field-${Date.now()}`;
    }
    onSave(formData);
  };

  // EARLY RETURNS
  // if (!data) return <div>Loading...</div>;

  // RENDER LOGIC
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[800px] max-w-[1200px] max-h-[100vh] overflow-y-auto p-0 flex flex-col"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-xl font-semibold">
              {field?.id ? "Edit Field" : "Add New Field"}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground mt-1">
              Configure the field properties for your form
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormData({
                      ...formData,
                      title: newTitle,
                      // Auto-generate key from title if key hasn't been manually edited
                      key: keyManuallyEdited
                        ? formData.key
                        : generateKeyFromTitle(newTitle, formData.id),
                    });
                  }}
                  placeholder="Field Label"
                />
                <p className="text-xs text-muted-foreground">
                  Display label for the field
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">
                  Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => {
                    setKeyManuallyEdited(true);
                    setFormData({ ...formData, key: e.target.value });
                  }}
                  placeholder="field_key"
                  pattern="^[a-z0-9_]+$"
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier (auto-generated from title, or edit
                  manually)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Field Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: SchemaField["type"]) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Text</SelectItem>
                  <SelectItem value="textarea">Long Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Dropdown (Static)</SelectItem>
                  <SelectItem value="database_dropdown">
                    Dropdown (Database)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Help text for users"
                rows={2}
              />
            </div>

            {formData.type === "select" && (
              <div className="space-y-2">
                <Label htmlFor="enum">Options (one per line)</Label>
                <Textarea
                  id="enum"
                  value={formData.enum?.join("\n") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enum: e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter((line) => line !== ""),
                    })
                  }
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Enter each option on a new line
                </p>
              </div>
            )}

            {formData.type === "database_dropdown" && (
              <Card className="p-4 space-y-4">
                <CardHeader className="p-0">
                  <CardTitle className="text-base">
                    Database Configuration
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Configure the data source for this dropdown
                  </CardDescription>
                </CardHeader>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="entity">
                      Entity/Table <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.dataSource?.entity || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          dataSource: {
                            ...formData.dataSource,
                            entity: value,
                            displayField: "",
                            valueField: "",
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="groups">Groups</SelectItem>
                        <SelectItem value="businessLines">
                          Business Lines
                        </SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Database table/entity name
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayField">
                      Display Field <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="displayField"
                      value={formData.dataSource?.displayField || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataSource: {
                            ...formData.dataSource,
                            displayField: e.target.value,
                          } as DatabaseDataSource,
                        })
                      }
                      placeholder="name"
                    />
                    <p className="text-xs text-muted-foreground">
                      Field to display (e.g., name, email)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valueField">
                      Value Field <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="valueField"
                      value={formData.dataSource?.valueField || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataSource: {
                            ...formData.dataSource,
                            valueField: e.target.value,
                          } as DatabaseDataSource,
                        })
                      }
                      placeholder="id"
                    />
                    <p className="text-xs text-muted-foreground">
                      Field to use as value (usually id)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filters">Filters (JSON)</Label>
                  <Textarea
                    id="filters"
                    value={
                      formData.dataSource?.filters
                        ? JSON.stringify(formData.dataSource.filters, null, 2)
                        : ""
                    }
                    onChange={(e) => {
                      try {
                        const filters = e.target.value
                          ? JSON.parse(e.target.value)
                          : undefined;
                        setFormData({
                          ...formData,
                          dataSource: {
                            ...formData.dataSource,
                            filters,
                          } as DatabaseDataSource,
                        });
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{"active": true}'
                    rows={3}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional JSON filters (e.g., {"{"}"active": true{"}"})
                  </p>
                </div>
              </Card>
            )}

            {(formData.type === "string" || formData.type === "textarea") && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Min Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    min="0"
                    value={formData.minLength || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minLength: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLength">Max Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    min="0"
                    value={formData.maxLength || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxLength: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {formData.type === "number" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minimum">Minimum</Label>
                  <Input
                    id="minimum"
                    type="number"
                    value={formData.minimum || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimum: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximum">Maximum</Label>
                  <Input
                    id="maximum"
                    type="number"
                    value={formData.maximum || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maximum: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {formData.type !== "checkbox" && formData.type !== "boolean" && (
              <div className="space-y-2">
                <Label htmlFor="default">Default Value</Label>
                <Input
                  id="default"
                  value={formData.default?.toString() || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      default:
                        formData.type === "number"
                          ? e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                          : e.target.value || undefined,
                    })
                  }
                  placeholder="Optional default value"
                />
              </div>
            )}

            {(formData.type === "checkbox" || formData.type === "boolean") && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Default Value</Label>
                  <p className="text-xs text-muted-foreground">
                    Checked by default
                  </p>
                </div>
                <Switch
                  checked={formData.default === true}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      default: checked || undefined,
                    })
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Required Field</Label>
                <p className="text-xs text-muted-foreground">
                  Users must fill this field
                </p>
              </div>
              <Switch
                checked={formData.required}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, required: checked })
                }
              />
            </div>

            {/* Conditional Logic Section */}
            <div className="border-t pt-4">
              <ConditionBuilder
                value={formData.conditionalLogic}
                onChange={(conditionalLogic) =>
                  setFormData({ ...formData, conditionalLogic })
                }
                availableFields={existingFields}
                currentFieldKey={formData.key}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-3 shrink-0">
            <Button size="sm" type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={handleSave}>
              {field?.id ? "Update Field" : "Add Field"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function getFieldType(prop: any): SchemaField["type"] {
  if (prop.format === "date") return "date";
  if (prop.format === "textarea") return "textarea";
  if (prop.format === "checkbox") return "checkbox";
  if (prop.format === "database_dropdown" || prop.dataSource)
    return "database_dropdown";
  if (prop.enum) return "select";
  if (prop.type === "boolean") return "boolean";
  if (prop.type === "number") return "number";
  return "string";
}

function getJsonSchemaType(
  type: SchemaField["type"]
): "string" | "number" | "boolean" {
  if (type === "number") return "number";
  if (type === "boolean" || type === "checkbox") return "boolean";
  return "string";
}
