// app/(core)/iam/roles/[id]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import RoleForm from "../../_components/role-form";

const Page = () => {
  const { id } = useParams();

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Edit Role
          <div className="text-muted-foreground text-sm font-normal">
            Edit the role
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <RoleForm id={id as string} />
      </div>
    </>
  );
};

export default Page;
