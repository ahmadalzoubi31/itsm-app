"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Type,
  FileText,
  List,
  Calendar,
  Hash,
  Mail,
  File,
  CheckSquare,
  Circle,
} from "lucide-react";
import { FormField, FormFieldType, ValidationRule } from "../types";

interface FormFieldBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export const FormFieldBuilder = ({
  fields,
  onChange,
}: FormFieldBuilderProps) => {
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldData, setFieldData] = useState<Partial<FormField>>({
    label: "",
    type: "text",
    placeholder: "",
    helpText: "",
    required: false,
    options: [],
    validationRules: [],
    defaultValue: "",
  });

  const fieldTypeOptions = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Textarea", icon: FileText },
    { value: "select", label: "Dropdown", icon: List },
    { value: "radio", label: "Radio Buttons", icon: Circle },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "date", label: "Date Picker", icon: Calendar },
    { value: "number", label: "Number Input", icon: Hash },
    { value: "email", label: "Email Input", icon: Mail },
    { value: "file", label: "File Upload", icon: File },
    { value: "multiselect", label: "Multi-select", icon: List },
  ];

  const [currentOption, setCurrentOption] = useState({ label: "", value: "" });

  const handleAddField = () => {
    setEditingField(null);
    setFieldData({
      label: "",
      type: "text",
      placeholder: "",
      helpText: "",
      required: false,
      options: [],
      validationRules: [],
      defaultValue: "",
    });
    setShowFieldDialog(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldData(field);
    setShowFieldDialog(true);
  };

  const handleSaveField = () => {
    if (!fieldData.label) return;

    const newField: FormField = {
      id: editingField?.id || `field_${Date.now()}`,
      label: fieldData.label || "",
      type: (fieldData.type as FormFieldType) || "text",
      placeholder: fieldData.placeholder,
      helpText: fieldData.helpText,
      required: fieldData.required || false,
      options: fieldData.options || [],
      validationRules: fieldData.validationRules || [],
      defaultValue: fieldData.defaultValue,
      conditional: fieldData.conditional,
    };

    if (editingField) {
      const updatedFields = fields.map((f) =>
        f.id === editingField.id ? newField : f
      );
      onChange(updatedFields);
    } else {
      onChange([...fields, newField]);
    }

    setShowFieldDialog(false);
    resetFieldData();
  };

  const handleDeleteField = (fieldId: string) => {
    onChange(fields.filter((f) => f.id !== fieldId));
  };

  const resetFieldData = () => {
    setFieldData({
      label: "",
      type: "text",
      placeholder: "",
      helpText: "",
      required: false,
      options: [],
      validationRules: [],
      defaultValue: "",
    });
    setEditingField(null);
  };

  const handleAddOption = () => {
    if (currentOption.label && currentOption.value) {
      const newOptions = [...(fieldData.options || []), currentOption];
      setFieldData({ ...fieldData, options: newOptions });
      setCurrentOption({ label: "", value: "" });
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = fieldData.options?.filter((_, i) => i !== index) || [];
    setFieldData({ ...fieldData, options: newOptions });
  };

  const requiresOptions =
    fieldData.type === "select" ||
    fieldData.type === "radio" ||
    fieldData.type === "multiselect";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Custom Form Fields</CardTitle>
            <CardDescription>
              Add custom fields to your service request form
            </CardDescription>
          </div>
          <Button onClick={handleAddField}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Type className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No custom fields configured.</p>
            <p className="text-sm">
              Add fields to collect additional information from users.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => {
              const fieldType = fieldTypeOptions.find(
                (ft) => ft.value === field.type
              );
              const IconComponent = fieldType?.icon || Type;

              return (
                <div key={field.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{field.label}</h4>
                        <p className="text-sm text-gray-600">
                          {fieldType?.label}
                        </p>
                        {field.required && (
                          <Badge variant="destructive" className="mt-1 text-xs">
                            Required
                          </Badge>
                        )}
                        {field.helpText && (
                          <p className="text-xs text-gray-500 mt-1">
                            {field.helpText}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditField(field)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Field Configuration Dialog */}
        <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingField ? "Edit Field" : "Add New Field"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field-label">Field Label *</Label>
                  <Input
                    id="field-label"
                    value={fieldData.label}
                    onChange={(e) =>
                      setFieldData({ ...fieldData, label: e.target.value })
                    }
                    placeholder="e.g., Department"
                  />
                </div>
                <div>
                  <Label htmlFor="field-type">Field Type *</Label>
                  <Select
                    value={fieldData.type}
                    onValueChange={(value) =>
                      setFieldData({
                        ...fieldData,
                        type: value as FormFieldType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="field-placeholder">Placeholder Text</Label>
                <Input
                  id="field-placeholder"
                  value={fieldData.placeholder}
                  onChange={(e) =>
                    setFieldData({ ...fieldData, placeholder: e.target.value })
                  }
                  placeholder="Hint text for users"
                />
              </div>

              <div>
                <Label htmlFor="field-help">Help Text</Label>
                <Textarea
                  id="field-help"
                  value={fieldData.helpText}
                  onChange={(e) =>
                    setFieldData({ ...fieldData, helpText: e.target.value })
                  }
                  placeholder="Additional guidance for users"
                  rows={2}
                />
              </div>

              {requiresOptions && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Option label"
                        value={currentOption.label}
                        onChange={(e) =>
                          setCurrentOption({
                            ...currentOption,
                            label: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Option value"
                        value={currentOption.value}
                        onChange={(e) =>
                          setCurrentOption({
                            ...currentOption,
                            value: e.target.value,
                          })
                        }
                      />
                      <Button size="sm" onClick={handleAddOption}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {fieldData.options?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">
                            {option.label} ({option.value})
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="field-required"
                  checked={fieldData.required}
                  onCheckedChange={(checked) =>
                    setFieldData({ ...fieldData, required: checked })
                  }
                />
                <Label htmlFor="field-required">Required Field</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowFieldDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveField} disabled={!fieldData.label}>
                <Save className="h-4 w-4 mr-2" />
                {editingField ? "Update Field" : "Add Field"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
