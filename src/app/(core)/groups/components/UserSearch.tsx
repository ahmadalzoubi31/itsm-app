"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, X } from "lucide-react";
import { GroupMemberRoleEnum } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUsers } from "../../users/hooks/useUsers";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface UserSearchProps {
  onUserSelect: (user: User, role: GroupMemberRoleEnum) => void;
  existingUserIds: string[];
  isLoading?: boolean;
}

export function UserSearch({
  onUserSelect,
  existingUserIds,
  isLoading = false,
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState<GroupMemberRoleEnum>(
    GroupMemberRoleEnum.MEMBER
  );

  // Mock users for demo - in real app, this would be fetched from API
  const { users: dbUsers } = useUsers();

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setUsers([]);
      return;
    }

    setIsSearching(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filteredUsers = dbUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );

    setUsers(filteredUsers);
    setIsSearching(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleUserSelect = (user: User) => {
    onUserSelect(user, selectedRole);
    setSearchTerm("");
    setUsers([]);
  };

  const filteredUsers = users.filter(
    (user) => !existingUserIds.includes(user.id)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userSearch">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="userSearch"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setSearchTerm("");
                  setUsers([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="userRole">Default Role</Label>
          <Select
            value={selectedRole}
            onValueChange={(value) =>
              setSelectedRole(value as GroupMemberRoleEnum)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={GroupMemberRoleEnum.MEMBER}>Member</SelectItem>
              <SelectItem value={GroupMemberRoleEnum.LEADER}>Leader</SelectItem>
              <SelectItem value={GroupMemberRoleEnum.ADMIN}>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        {/* <div className="flex items-end">
          <div className="text-sm text-muted-foreground">
            {isSearching
              ? "Searching..."
              : `${filteredUsers.length} users found`}
          </div>
        </div> */}
      </div>

      {filteredUsers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedRole}</Badge>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchTerm && !isSearching && filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">
              No users found matching "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
