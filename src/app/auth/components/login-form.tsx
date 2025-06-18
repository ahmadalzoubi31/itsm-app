"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
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
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function LoginForm() {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const promise = () =>
      new Promise(
        async (resolve, reject) =>
          await fetch(getBackendUrl("/api/auth/sign-in"), {
            method: "POST",
            credentials: "include", // Important for cookies!
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
            }),
          }).then((res) => {
            if (res.ok) {
              resolve(res);
            } else {
              reject(res);
            }
          })
      );

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        router.push("/");
        return `Signed in successfully!`;
      },
      error: (error: Response) => {
        return `Sign in failed, ${error.statusText}`;
      },
    });
  }
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
                      <Input id="username" type="text" required {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
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
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Create a new account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary underline-offset-4 transition-colors hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
