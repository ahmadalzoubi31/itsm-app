// app/(core)/iam/roles/new/page.tsx
"use client";

import RoleForm from "../_components/role-form";

const Page = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Create Role
          <div className="text-muted-foreground text-sm font-normal">
            Create a new role
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <RoleForm id="" />
      </div>
    </>
  );
};

export default Page;
