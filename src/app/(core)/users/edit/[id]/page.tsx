import React from "react";
import { UserPenIcon } from "lucide-react";
import UserForm from "../../components/UserForm";

const EditUserPage = () => {
  return (
    <>
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <UserPenIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">Edit user details</p>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-6">
        <UserForm />
      </div>
    </>
  );
};

export default EditUserPage;
