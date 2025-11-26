"use client";

import GroupForm from "../../_components/form/group-form";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Edit Group
          <div className="text-muted-foreground text-sm font-normal">
            Edit the group details by providing the name, type, description, and
            business line.
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <GroupForm id={id as string} />
      </div>
    </>
  );
};

export default Page;
