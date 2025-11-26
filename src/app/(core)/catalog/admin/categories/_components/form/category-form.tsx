"use client";

import { useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";

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
  categorySchema,
  type CategoryFormValues,
} from "@/app/(core)/catalog/admin/categories/_lib/_schemas/category.schema";
import { useCategoryHook } from "@/app/(core)/catalog/admin/categories/_lib/_hooks/useCategory";
import { upsertCategoryAction } from "@/app/(core)/catalog/admin/categories/actions";

// If your backend returns subcategories on `findOne` (as per controller description)
type CategoryWithSubcategories = CategoryFormValues & {
  subcategories?: {
    id: string;
    key: string;
    name: string;
    description?: string | null;
    active: boolean;
  }[];
};

type Props = { id?: string };

const CategoryForm = ({ id }: Props) => {
  const router = useRouter();
  const isEdit = !!id;

  const {
    category,
    isLoading,
  }: {
    category?: CategoryWithSubcategories | null;
    isLoading: boolean;
  } = useCategoryHook(id || "");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      active: true,
    },
  });

  useEffect(() => {
    if (isEdit && category) {
      form.reset({
        id: category.id,
        key: category.key,
        name: category.name,
        description: category.description ?? "",
        active:
          typeof (category as any).active === "boolean"
            ? (category as any).active
            : true,
      });
    }
  }, [category, isEdit, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    const promise = async () => {
      // CreateCaseCategoryDto doesn't have 'active' field
      // UpdateCaseCategoryDto has 'active' as optional
      const payload = isEdit
        ? { ...values, id } // Include active for updates
        : {
            key: values.key,
            name: values.name,
            description: values.description,
          }; // Exclude active for creates

      await upsertCategoryAction(payload as CategoryFormValues);
    };

    toast.promise(promise, {
      loading: isEdit ? "Updating category..." : "Creating category...",
      success: isEdit
        ? "Category updated successfully"
        : "Category created successfully",
      error: "Something went wrong",
    });

    router.push("/catalog/admin/categories");
  };

  if (isEdit && isLoading && !category) {
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

  const subcategories = (category?.subcategories ?? []) as {
    id: string;
    key: string;
    name: string;
    description?: string | null;
    active: boolean;
  }[];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Category" : "Create Category"}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? "Update the case category details"
                : "Create a new case category (Incident, Service Request, etc.)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            {/* Key */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="incident"
                      {...field}
                      disabled={isEdit} // key is immutable in DTOs (no key in Update DTO)
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Unique identifier in lowercase kebab-case (e.g.{" "}
                    <code>incident</code>, <code>service-request</code>).
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
                    <Input placeholder="Incident" {...field} />
                  </FormControl>
                  <FormDescription>
                    Display name of the case category.
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
                      placeholder="Unplanned interruption to an IT service, or reduction in the quality of an IT service."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of this case category.
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
                        ? "This category is active and can be used for new cases."
                        : "This category is inactive and cannot be used for new cases."}
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

        {/* Subcategories (read-only list based on backend relation) */}
        {isEdit && (
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
              <CardDescription>
                Case subcategories related to this category
                {subcategories.length === 0 ? ". No subcategories found." : "."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              {subcategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subcategories defined yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-col rounded-md border p-3 gap-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {sub.key}
                          </Badge>
                          <span className="font-medium">{sub.name}</span>
                        </div>
                        <Badge
                          variant={sub.active ? "default" : "secondary"}
                          className={sub.active ? "" : "opacity-70"}
                        >
                          {sub.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {sub.description && (
                        <p className="text-xs text-muted-foreground">
                          {sub.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* You can later wire this to a dedicated subcategory management page */}
              {isEdit && (
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/catalog/admin/subcategories?categoryId=${id}`
                      )
                    }
                  >
                    Manage Subcategories
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
            {isEdit ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
