"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginSchema } from "../schemas/auth.schema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks";


export default function LoginForm() {
  const router = useRouter();

  const { login, isLoading } = useLogin({
    onSuccess: () => {
      toast.success("User logged in successfully");
      router.push("/iam/users");
    },
    onError: (error) => {
      console.error("Error logging in:", error);
      toast.error(`Sign in failed: ${error.statusText}`);
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    login(data);
  };

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        type="text"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs">
                      {form.formState.errors.username?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs">
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Create a new account?{" "}
          <Link
            href={ROUTES.auth.signUp}
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter> */}
    </Card>
  );
};

