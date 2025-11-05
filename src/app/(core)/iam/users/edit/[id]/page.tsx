"use client";

import EditUserForm from "./components/EditUserForm";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Edit User
          <div className="text-muted-foreground text-sm font-normal">
            Edit the user
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <EditUserForm userId={id as string} />
      </div>
    </>
  );
};

export default Page;
