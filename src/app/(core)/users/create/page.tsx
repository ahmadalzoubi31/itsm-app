import React from "react";
import { UserPlus } from "lucide-react";
import CreateUserForm from "../components/CreateUserForm";

const CreateUserPage = () => {
  return (
    <>
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create New User
            </h1>
            <p className="text-muted-foreground">
              Add a new user to the system with appropriate roles and
              permissions
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-6">
        <CreateUserForm />
      </div>
    </>
  );
};

export default CreateUserPage;
