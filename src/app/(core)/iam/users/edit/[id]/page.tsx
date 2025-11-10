"use client";

import UserForm from "../../components/user-form";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Invalid User ID
          </h2>
          <p className="text-muted-foreground mt-2">
            No user ID was provided in the URL
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Edit User
          <div className="text-muted-foreground text-sm font-normal">
            Modify user details, roles, and permissions
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <UserForm id={userId} />
      </div>
    </>
  );
};

export default Page;
