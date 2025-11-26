"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  subcategorySchema,
  type SubcategoryFormValues,
} from "@/app/(core)/catalog/admin/subcategories/_lib/_schemas/subcategory.schema";
import { useSubcategoryHook } from "@/app/(core)/catalog/admin/subcategories/_lib/_hooks/useSubcategory";
import { upsertSubcategoryAction } from "@/app/(core)/catalog/admin/subcategories/actions";
import { useCategoriesHook } from "@/app/(core)/catalog/admin/categories/_lib/_hooks/useCategories";

type Props = { id?: string; defaultCategoryId?: string };

const SubcategoryForm = ({ id, defaultCategoryId }: Props) => {
  const router = useRouter();
  const isEdit = !!id;

  const { subcategory, isLoading } = useSubcategoryHook(id || "");
  const { categories } = useCategoriesHook();

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      key: "",
      name: "",
      categoryId: defaultCategoryId || "",
      description: "",
      active: true,
    },
  });

  useEffect(() => {
    if (isEdit && subcategory) {
      form.reset({
        id: subcategory.id,
        key: subcategory.key,
        name: subcategory.name,
        categoryId: subcategory.categoryId,
        description: subcategory.description ?? "",
        active:
          typeof subcategory.active === "boolean" ? subcategory.active : true,
      });
    }
  }, [subcategory, isEdit, form]);

  const onSubmit = async (values: SubcategoryFormValues) => {
    const promise = async () => {
      // CreateCaseSubcategoryDto doesn't have 'active' field
      // UpdateCaseSubcategoryDto has 'active' as optional
      const payload = isEdit
        ? { ...values, id } // Include active for updates
        : {
            key: values.key,
            name: values.name,
            categoryId: values.categoryId,
            description: values.description,
          }; // Exclude active for creates

      await upsertSubcategoryAction(payload as SubcategoryFormValues);
    };

    toast.promise(promise, {
      loading: isEdit ? "Updating subcategory..." : "Creating subcategory...",
      success: isEdit
        ? "Subcategory updated successfully"
        : "Subcategory created successfully",
      error: "Something went wrong",
    });

    router.push("/catalog/admin/subcategories");
  };

  if (isEdit && isLoading && !subcategory) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter active categories
  const activeCategories = categories.filter((cat) => cat.active);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Subcategory" : "Create Subcategory"}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? "Update the case subcategory details"
                : "Create a new case subcategory"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The parent category for this subcategory.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Key */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hardware"
                      {...field}
                      disabled={isEdit} // key is immutable in DTOs (no key in Update DTO)
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Unique identifier in lowercase kebab-case (e.g.{" "}
                    <code>hardware</code>, <code>software</code>).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hardware" {...field} />
                  </FormControl>
                  <FormDescription>
                    Display name of the case subcategory.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Issues related to computer hardware components"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of this case subcategory.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-1">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      {field.value
                        ? "This subcategory is active and can be used for new cases."
                        : "This subcategory is inactive and cannot be used for new cases."}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button type="submit" size="sm">
            {isEdit ? "Update Subcategory" : "Create Subcategory"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubcategoryForm;
