"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, UserPlus, UserX, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface StagedUser {
  id: string;
  cn: string;
  mail: string;
  sam_account_name: string;
  display_name: string;
  department: string;
  status: "new" | "updated" | "existing" | "disabled";
  selected: boolean;
}

export const UserStaging = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<StagedUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStagedUsers();
  }, []);

  const loadStagedUsers = async () => {
    setLoading(true);
    // try {
    //   const { data, error } = await supabase
    //     .from("staged_users")
    //     .select("*")
    //     .order("created_at", { ascending: false });

    //   if (error) throw error;

    //   const usersWithSelection = data.map((user) => ({
    //     id: user.id,
    //     cn: user.cn,
    //     mail: user.mail || "",
    //     sam_account_name: user.sam_account_name || "",
    //     display_name: user.display_name || "",
    //     department: user.department || "",
    //     status: user.status as "new" | "updated" | "existing" | "disabled",
    //     selected: false,
    //   }));

    //   setUsers(usersWithSelection);
    // } catch (error: any) {
    //   console.error("Error loading staged users:", error);
    //   toast({
    //     title: "Error loading users",
    //     description: error.message,
    //     variant: "destructive",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  const simulateLdapImport = async () => {
    setLoading(true);
    try {
      // Add some sample users to simulate LDAP import
      const sampleUsers = [
        {
          cn: "John Doe",
          mail: "john.doe@company.com",
          sam_account_name: "jdoe",
          display_name: "John Doe",
          department: "IT",
          status: "new",
          ldap_dn: "CN=John Doe,OU=Users,DC=company,DC=com",
          raw_attributes: {},
        },
        {
          cn: "Jane Smith",
          mail: "jane.smith@company.com",
          sam_account_name: "jsmith",
          display_name: "Jane Smith",
          department: "HR",
          status: "updated",
          ldap_dn: "CN=Jane Smith,OU=Users,DC=company,DC=com",
          raw_attributes: {},
        },
      ];

      //   const { error } = await supabase.from("staged_users").insert(sampleUsers);

      //   if (error) throw error;

      toast.success("LDAP Import Simulated");

      await loadStagedUsers();
    } catch (error: any) {
      console.error("Error simulating LDAP import:", error);
      toast.error("Error importing users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-green-500 hover:bg-green-600">New</Badge>;
      case "updated":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Updated</Badge>;
      case "existing":
        return <Badge variant="secondary">Existing</Badge>;
      case "disabled":
        return <Badge variant="destructive">Disabled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const toggleUserSelection = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const selectAll = () => {
    const allSelected = filteredUsers.every((user) => user.selected);
    setUsers(
      users.map((user) => ({
        ...user,
        selected: filteredUsers.some(
          (filteredUser) => filteredUser.id === user.id
        )
          ? !allSelected
          : user.selected,
      }))
    );
  };

  const importSelectedUsers = async () => {
    const selectedUsers = users.filter((user) => user.selected);
    if (selectedUsers.length === 0) return;

    try {
      // const { error } = await supabase
      //   .from("staged_users")
      //   .delete()
      //   .in(
      //     "id",
      //     selectedUsers.map((user) => user.id)
      //   );

      // if (error) throw error;

      toast.success("Users imported");

      await loadStagedUsers();
    } catch (error: any) {
      console.error("Error importing users:", error);
      toast.error("Error importing users");
    }
  };

  const rejectSelectedUsers = async () => {
    const selectedUsers = users.filter((user) => user.selected);
    if (selectedUsers.length === 0) return;

    try {
      // const { error } = await supabase
      //   .from("staged_users")
      //   .delete()
      //   .in(
      //     "id",
      //     selectedUsers.map((user) => user.id)
      //   );

      // if (error) throw error;

      toast.error("Users rejected");

      await loadStagedUsers();
    } catch (error: any) {
      console.error("Error rejecting users:", error);
      toast.error("Error rejecting users");
    }
  };

  const exportUserList = () => {
    const csvContent = [
      "Display Name,Email,Username,Department,Status",
      ...filteredUsers.map(
        (user) =>
          `"${user.display_name}","${user.mail}","${user.sam_account_name}","${user.department}","${user.status}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staged_users.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Export completed");
  };

  const selectedCount = users.filter((user) => user.selected).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Staging Area
          </CardTitle>
          <CardDescription>
            Review and manage users retrieved from LDAP before importing them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="existing">Existing</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <Button
              onClick={simulateLdapImport}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {loading ? "Loading..." : "Simulate LDAP Import"}
            </Button>
            <Button
              onClick={importSelectedUsers}
              disabled={selectedCount === 0}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Import Selected ({selectedCount})
            </Button>
            <Button
              variant="destructive"
              onClick={rejectSelectedUsers}
              disabled={selectedCount === 0}
              className="flex items-center gap-2"
            >
              <UserX className="w-4 h-4" />
              Reject Selected
            </Button>
            <Button
              variant="outline"
              onClick={exportUserList}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredUsers.length > 0 &&
                        filteredUsers.every((user) => user.selected)
                      }
                      onCheckedChange={selectAll}
                    />
                  </TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={user.selected}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.display_name}
                    </TableCell>
                    <TableCell>{user.mail}</TableCell>
                    <TableCell>{user.sam_account_name}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {loading
                ? "Loading users..."
                : "No users found matching your criteria"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
