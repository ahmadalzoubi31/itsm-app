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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { RequestCardFormValues } from "@/app/(core)/catalog/admin/request-cards/_lib/_schemas/request-card.schema";

interface SettingsTabProps {
  groups: Array<{ id: string; name: string; memberships?: Array<any> }>;
}

const SettingsTab = ({ groups }: SettingsTabProps) => {
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
        <CardTitle>Request Card Settings</CardTitle>
        <CardDescription>
          Configure assignment and workflow settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator className="my-2" />

        <FormField
          control={form.control}
          name="defaultAssignmentGroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Assignment Group</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups
                      .filter(
                        (group) =>
                          group.memberships && group.memberships.length > 0
                      )
                      .map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Requests from this card will be assigned to this group by
                default
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5 flex-1">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Make this request card available to users
                </FormDescription>
                <FormMessage />
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
  );
};

export default SettingsTab;
