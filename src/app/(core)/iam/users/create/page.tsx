"use client";

import UserForm from "../components/user-form";

const Page = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Create User
          <div className="text-muted-foreground text-sm font-normal">
            Create a new user
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <UserForm id="" />
      </div>
    </>
  );
};

export default Page;
