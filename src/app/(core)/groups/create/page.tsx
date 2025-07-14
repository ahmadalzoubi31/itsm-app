import React from "react";
import { Users } from "lucide-react";
import GroupForm from "../components/GroupForm";

const CreateGroupPage = () => {
  return (
    <>
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Create New Group
            </h1>
            <p className="text-muted-foreground">
              Create a new support group with appropriate settings and members
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-6">
        <GroupForm />
      </div>
    </>
  );
};

export default CreateGroupPage; 