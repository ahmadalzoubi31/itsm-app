"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import SchemaBuilder from "./SchemaBuilder";
import { RequestCardFormValues } from "@/app/(core)/catalog/admin/request-cards/_lib/_schemas/request-card.schema";

const SchemaTab = () => {
  // HOOKS
  // Custom Hooks
  const form = useFormContext<RequestCardFormValues>();

  // React Hooks

  // EFFECTS
  // useEffect(() => {}, []);

  // HELPERS
  // const helperFn = () => {};

  // EVENT HANDLERS
  // const handleClick = () => {};

  // EARLY RETURNS
  // if (!data) return <div>Loading...</div>;

  // RENDER LOGIC
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Questions</CardTitle>
        <CardDescription>
          Define the form fields using JSON Schema
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="jsonSchema"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SchemaBuilder value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage className="mt-2" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default SchemaTab;
