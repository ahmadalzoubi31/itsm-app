"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Mail, Shield, Calendar, UserCheck, UserX } from "lucide-react";
import { getGroupMembers } from "@/app/(core)/iam/groups/_lib/_services/group.service";
import { User as UserType } from "@/app/(core)/iam/users/_lib/_types/user.type";
import { Group } from "@/app/(core)/iam/groups/_lib/_types/group.type";
import { toast } from "sonner";

interface GroupMembersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
}

export function GroupMembersDrawer({
  open,
  onOpenChange,
  group,
}: GroupMembersDrawerProps) {
  const [members, setMembers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && group.id) {
      fetchMembers();
    }
  }, [open, group.id]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getGroupMembers(group.id);
      setMembers(data);
    } catch (error: any) {
      toast.error(`Failed to load members: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Group Members
          </SheetTitle>
          <SheetDescription>
            Members of <span className="font-semibold">{group.name}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4  p-4">
          {/* Group Info */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Group Type</span>
              <Badge variant="outline" className="font-mono text-xs">
                {group.type}
              </Badge>
            </div>
            {group.description && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Description</span>
                <span className="text-sm text-muted-foreground">
                  {group.description}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Members</span>
              <Badge variant="secondary">
                {isLoading ? "..." : members.length}
              </Badge>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Members</h3>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserX className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No members in this group yet
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-3 pr-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {member.displayName}
                          </p>
                          {member.isActive ? (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="truncate">{member.username}</span>
                          </div>
                          {member.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Shield className="h-3 w-3" />
                            <span className="capitalize">
                              {member.authSource}
                            </span>
                          </div>
                          {member.lastLoginAt && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Last login:{" "}
                                {new Date(
                                  member.lastLoginAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        {member.roles && member.roles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.roles.map((role) => (
                              <Badge
                                key={role.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
