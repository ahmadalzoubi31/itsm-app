"use client";

import RoleForm from "./components/RoleForm";

const Page = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Create Role
          <div className="text-muted-foreground text-sm font-normal">
            Create a new role
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <RoleForm />
      </div>
    </>
  );
};

export default Page;
