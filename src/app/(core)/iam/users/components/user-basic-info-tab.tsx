import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { AuthSource } from "../interfaces/user.interface";

// Accept the whole form instance as prop
type Props = {
  form: UseFormReturn<any>;
};

export default function UserBasicInfo({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Enter the user's personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jdoe"
                    autoComplete="username"
                    maxLength={80}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" maxLength={150} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Mail className="h-4 w-4 inline" /> Email Address (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@company.com"
                    maxLength={150}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authentication Source</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as AuthSource}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select authentication source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AuthSource.LOCAL}>Local</SelectItem>
                    <SelectItem value={AuthSource.LDAP}>LDAP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch("authSource") === AuthSource.LOCAL && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Lock className="h-4 w-4 inline" /> Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="SecurePass123!"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number/special character
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="externalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="AD GUID (for LDAP users)" {...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                External identifier for LDAP users
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
