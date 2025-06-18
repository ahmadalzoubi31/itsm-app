"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "At least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "At least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "At least 6 characters.",
  }),
  username: z.string(),
});

export function RegisterForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    signUpMutation
      .mutateAsync({
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`.trim(),
        username: values.username,
      })
      .catch((error) => {
        console.error("Sign up failed:", error);
      });
  }

  // Sign Up Mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, name, username }: { email: string; password: string; name: string; username: string }) => {
      // return await authClient.signUp.email({
      //   email,
      //   password,
      //   name,
      //   username,
      //   callbackURL: "/auth/sign-in",
      // });
    },
    onSuccess: (data: any) => {
      toast.success("Signed up successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Sign up failed");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input id="first-name" type="text" placeholder="John" required {...field} disabled={signUpMutation.isPending} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input id="last-name" type="text" placeholder="Doe" required {...field} disabled={signUpMutation.isPending} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input id="username" type="text" placeholder="johndoe" required {...field} disabled={signUpMutation.isPending} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" placeholder="example@example.com" required {...field} disabled={signUpMutation.isPending} />
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
                      <Input id="password" type="password" placeholder="••••••••" required {...field} disabled={signUpMutation.isPending} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="w-full mt-2" disabled={signUpMutation.isPending}>
              {signUpMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary underline-offset-4 transition-colors hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
