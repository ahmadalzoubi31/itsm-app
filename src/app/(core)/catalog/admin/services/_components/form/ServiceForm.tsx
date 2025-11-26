"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  serviceSchema,
  ServiceFormValues,
} from "../../_lib/_schemas/service.schema";
// import {
//   createService,
//   updateService,
//   fetchServiceById,
// } from "../../../../services/catalog.service";
import { fetchBusinessLines } from "@/app/(core)/settings/services/business-line.service";
import {
  fetchCaseCategories,
  fetchCaseSubcategories,
} from "@/app/(core)/cases/services/case.service";
import type { CaseCategory, CaseSubcategory } from "@/app/(core)/cases/types";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Key,
  FileText,
  AlignLeft,
  Building2,
  Loader2,
  Save,
  X,
  FolderTree,
  Tags,
} from "lucide-react";

interface ServiceFormProps {
  id?: string;
}

export function ServiceForm({ id }: ServiceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [categories, setCategories] = useState<CaseCategory[]>([]);
  const [subcategories, setSubcategories] = useState<CaseSubcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    CaseSubcategory[]
  >([]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      businessLineId: "",
      categoryId: "",
      subcategoryId: "",
    },
  });

  // useEffect(() => {
  //   // Fetch business lines
  //   fetchBusinessLines()
  //     .then(setBusinessLines)
  //     .catch((error) => toast.error("Failed to load business lines"));

  //   // Fetch categories
  //   fetchCaseCategories()
  //     .then(setCategories)
  //     .catch((error) => toast.error("Failed to load categories"));

  //   // Fetch all subcategories
  //   fetchCaseSubcategories()
  //     .then(setSubcategories)
  //     .catch((error) => toast.error("Failed to load subcategories"));

  //   // Prefill if editing
  //   if (id) {
  //     setLoading(true);
  //     fetchServiceById(id)
  //       .then((service) => {
  //         form.reset({
  //           key: service.key,
  //           name: service.name,
  //           description: service.description || "",
  //           businessLineId: service.businessLineId,
  //           categoryId: service.categoryId,
  //           subcategoryId: service.subcategoryId,
  //         });
  //       })
  //       .catch((error) => {
  //         toast.error(`Failed to fetch service: ${error.message}`);
  //         router.push("/catalog/admin/services");
  //       })
  //       .finally(() => setLoading(false));
  //   }
  // }, [id, form, router]);

  // Watch category changes to filter subcategories
  const selectedCategoryId = form.watch("categoryId");

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId === selectedCategoryId
      );
      setFilteredSubcategories(filtered);

      // Reset subcategory if it doesn't belong to the selected category
      const currentSubcategoryId = form.getValues("subcategoryId");
      if (
        currentSubcategoryId &&
        !filtered.find((sub) => sub.id === currentSubcategoryId)
      ) {
        form.setValue("subcategoryId", "");
      }
    } else {
      setFilteredSubcategories([]);
      form.setValue("subcategoryId", "");
    }
  }, [selectedCategoryId, subcategories, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    const promise = async () => {
      if (id) {
        // await updateService(id, data);
      } else {
        // await createService(data);
      }
    };

    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        queryClient.refetchQueries({ queryKey: ["services"] });
        router.push("/catalog/admin/services");
        return `Service ${id ? "updated" : "created"} successfully!`;
      },
      error: (error: any) => {
        return `${error || "Unknown error"}`;
      },
    });
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-primary/10 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-xl border-primary/10 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Service Information
                </CardTitle>
                <CardDescription className="text-base">
                  Enter the basic information for the service. Fields marked
                  with <span className="text-destructive">*</span> are required.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Key Field */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Service Key <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="it-helpdesk"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Unique identifier using lowercase letters, numbers, and
                    hyphens only
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Service Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="IT Helpdesk"
                      {...field}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Display name that will be shown to users throughout the
                    application
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    Description{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="General IT support and helpdesk services for all employees..."
                      {...field}
                      rows={4}
                      className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Provide a brief description of what this service offers and
                    who it serves
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Business Line Field */}
            <FormField
              control={form.control}
              name="businessLineId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Business Line <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select a business line" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessLines.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            No business lines available
                          </div>
                        ) : (
                          businessLines.map((line) => (
                            <SelectItem key={line.id} value={line.id}>
                              {line.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs">
                    The organizational business line this service belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            No categories available
                          </div>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs">
                    The category that this service belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subcategory Field */}
            <FormField
              control={form.control}
              name="subcategoryId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Tags className="h-4 w-4 text-muted-foreground" />
                    Subcategory <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCategoryId}
                    >
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <SelectValue
                          placeholder={
                            selectedCategoryId
                              ? "Select a subcategory"
                              : "Select a category first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            {selectedCategoryId
                              ? "No subcategories available for this category"
                              : "Please select a category first"}
                          </div>
                        ) : (
                          filteredSubcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.id}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs">
                    The specific subcategory within the selected category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-lg border-primary/10 bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {id
                  ? "Update the service information above"
                  : "Ready to add this service to your catalog?"}
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/catalog/admin/services")}
                  className="group hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200"
                  disabled={form.formState.isSubmitting}
                >
                  <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {id ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      {id ? "Update Service" : "Create Service"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
