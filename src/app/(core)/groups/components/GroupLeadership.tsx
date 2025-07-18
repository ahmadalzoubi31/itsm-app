import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Crown, Activity, Check, ChevronsUpDown } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GROUP_STATUSES } from "../constants/group-status.constant";
import { useUsers } from "../../users/hooks/useUsers";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  form: UseFormReturn<any>;
};

export default function GroupLeadership({ form }: Props) {
  const [leaderSearchOpen, setLeaderSearchOpen] = useState(false);
  const { users, isLoading: isLoadingUsers } = useUsers();

  const selectedLeaderId = form.watch("leaderId");
  const watchedMemberIds = form.watch("memberIds");

  // Filter users to only show group members
  const groupMembers = users.filter((user) =>
    watchedMemberIds?.includes(user.id)
  );

  // Find selected leader
  const selectedLeader = users.find((user) => user.id === selectedLeaderId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Leadership & Status
        </CardTitle>
        <CardDescription>
          Assign group leadership and set status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="leaderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Leader</FormLabel>
                <Popover
                  open={leaderSearchOpen}
                  onOpenChange={setLeaderSearchOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={leaderSearchOpen}
                        className="w-full justify-between"
                      >
                        {selectedLeader
                          ? `${selectedLeader.fullName} (${selectedLeader.email})`
                          : "Select a leader..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="no-leader"
                            onSelect={() => {
                              form.setValue("leaderId", "");
                              setLeaderSearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                !selectedLeaderId ? "opacity-100" : "opacity-0"
                              )}
                            />
                            No leader assigned
                          </CommandItem>
                          {isLoadingUsers ? (
                            <CommandItem disabled>
                              <div className="flex items-center">
                                <Skeleton className="mr-2 h-4 w-4" />
                                <Skeleton className="h-4 w-[100px]" />
                              </div>
                            </CommandItem>
                          ) : groupMembers.length > 0 ? (
                            groupMembers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={`${user.fullName} ${user.email}`}
                                onSelect={() => {
                                  form.setValue("leaderId", user.id);
                                  setLeaderSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLeaderId === user.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{user.fullName}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled>
                              No group members available. Add members first to
                              select a leader.
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Activity className="h-4 w-4 inline mr-1" />
                  Status
                  <span className="text-xs text-red-500 font-medium ml-1">
                    (required)
                  </span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GROUP_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
