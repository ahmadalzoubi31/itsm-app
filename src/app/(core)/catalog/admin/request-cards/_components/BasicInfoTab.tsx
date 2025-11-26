"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { RequestCardFormValues } from "@/app/(core)/catalog/admin/request-cards/_lib/_schemas/request-card.schema";

interface BasicInfoTabProps {
  services: Array<{ id: string; name: string }>;
}

const BasicInfoTab = ({ services }: BasicInfoTabProps) => {
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
        <CardTitle>Request Card Information</CardTitle>
        <CardDescription>
          Basic information about the request card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator className="my-2" />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  The service this request card belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input placeholder="new-laptop" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier (lowercase, alphanumeric, hyphens)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="New Laptop Request" {...field} />
                </FormControl>
                <FormDescription>
                  Display name for the request card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
