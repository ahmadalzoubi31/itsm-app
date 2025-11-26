import { ServiceForm } from "../_components/form/ServiceForm";

export default function CreateServicePage() {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Create Service
          <div className="text-muted-foreground text-sm font-normal">
            Create a new service
          </div>
        </div>
      </div>

      <div className="px-[2rem] lg:px-8">
        <ServiceForm />
      </div>
    </>
  );
}
