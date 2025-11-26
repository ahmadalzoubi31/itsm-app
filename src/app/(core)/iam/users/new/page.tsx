import UserForm from "@/app/(core)/iam/users/_components/form/user-form";

export default function CreateUserPage() {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Create User
          <div className="text-muted-foreground text-sm font-normal">
            Create a new user
          </div>
        </div>
      </div>

      <div className="px-[2rem] lg:px-8">
        <UserForm id={undefined} />
      </div>
    </>
  );
}
