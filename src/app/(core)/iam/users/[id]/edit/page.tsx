import { notFound } from "next/navigation";
import UserForm from "@/app/(core)/iam/users/_components/form/user-form";
import { getUserServer } from "@/app/(core)/iam/users/_lib/_services/user.server";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUserServer(id);

  if (!user) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Edit User
          <div className="text-muted-foreground text-sm font-normal">
            Modify user details, roles, and permissions
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <UserForm id={id} initialData={user} />
      </div>
    </>
  );
}
