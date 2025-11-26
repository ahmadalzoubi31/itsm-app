"use client";

import GroupForm from "../_components/form/group-form";

const Page = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Create Group
          <div className="text-muted-foreground text-sm font-normal">
            Create a new group
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <GroupForm id={""} />
      </div>
    </>
  );
};

export default Page;
