"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, UserMinus, Crown, Shield } from "lucide-react";
import { Group, GroupMember, GroupMemberRoleEnum } from "../types";
import {
  fetchGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  updateMemberRole,
} from "../services/group.service";
import { toast } from "sonner";
import { UserSearch } from "./UserSearch";

interface GroupMembersDialogProps {
  group: Group;
  trigger?: React.ReactNode;
}

export function GroupMembersDialog({
  group,
  trigger,
}: GroupMembersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchGroupMembers(group.id);
      setMembers(response.data);
    } catch (error) {
      toast.error("Failed to load group members");
      console.error("Error loading members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, group.id]);

  const handleRemoveMember = async (userId: string) => {
    try {
      setIsLoading(true);
      await removeMemberFromGroup(group.id, userId);
      toast.success("Member removed successfully");
      loadMembers();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (
    userId: string,
    role: GroupMemberRoleEnum
  ) => {
    try {
      setIsLoading(true);
      await updateMemberRole(group.id, userId, role);
      toast.success("Member role updated successfully");
      loadMembers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update member role");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: GroupMemberRoleEnum) => {
    switch (role) {
      case GroupMemberRoleEnum.LEADER:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case GroupMemberRoleEnum.ADMIN:
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: GroupMemberRoleEnum) => {
    switch (role) {
      case GroupMemberRoleEnum.LEADER:
        return "bg-yellow-100 text-yellow-800";
      case GroupMemberRoleEnum.ADMIN:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const content = (
    <div className="space-y-8">
      {/* Add Member Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <UserPlus className="h-5 w-5" />
            Add New Member
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <UserSearch
            onUserSelect={async (user, role) => {
              try {
                setIsLoading(true);
                await addMemberToGroup(group.id, user.id, role);
                toast.success("Member added successfully");
                loadMembers();
              } catch (error: any) {
                toast.error(error.message || "Failed to add member");
              } finally {
                setIsLoading(false);
              }
            }}
            existingUserIds={members.map((m) => m.userId)}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Members List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Users className="h-5 w-5" />
            Current Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground font-medium">
                Loading members...
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-muted-foreground font-medium text-lg">
                No members in this group
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first team member using the form above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-base font-semibold">
                        {member.user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-semibold text-base">
                        {member.user?.fullName || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getRoleColor(member.role)}>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </div>
                    </Badge>
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleUpdateRole(
                          member.userId,
                          value as GroupMemberRoleEnum
                        )
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GroupMemberRoleEnum.MEMBER}>
                          Member
                        </SelectItem>
                        <SelectItem value={GroupMemberRoleEnum.LEADER}>
                          Leader
                        </SelectItem>
                        <SelectItem value={GroupMemberRoleEnum.ADMIN}>
                          Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.userId)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const triggerElement = trigger || (
    <Button variant="outline" size="sm">
      <Users className="h-4 w-4 mr-2" />
      Manage Members
    </Button>
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{triggerElement}</DrawerTrigger>
      <DrawerContent
        className="h-full overflow-y-hidden"
        data-vaul-drawer-direction="right"
      >
        <DrawerHeader className="pb-8 px-6 pt-6">
          <DrawerTitle className="flex items-center gap-3 text-2xl font-semibold">
            <Users className="h-7 w-7" />
            {group.name}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-6 pb-6">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
