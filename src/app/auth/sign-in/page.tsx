import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { LoginForm } from "@/app/auth/components/login-form";

const Page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            QoreDesk.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image src="/assets/placeholder.svg" alt="Image" fill className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
};

export default Page;
