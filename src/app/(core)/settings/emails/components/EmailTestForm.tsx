"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
} from "lucide-react";

import {
  testEmailSchema,
  TestEmailForm as TestEmailFormType,
} from "../validations/email.schema";
import { useEmailTest } from "../hooks/useEmailSettings";
import { EmailTestResult } from "../types";

interface EmailTestFormProps {
  onTestResult?: (result: EmailTestResult) => void;
}

export function EmailTestForm({ onTestResult }: EmailTestFormProps) {
  const { testing, testResult, testConnection, sendTest } = useEmailTest();
  const [testMode, setTestMode] = useState<"connection" | "email">(
    "connection"
  );

  const form = useForm<TestEmailFormType>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      to: "",
      subject: "Test Email from ITSM System",
      body: "This is a test email to verify your email configuration is working correctly.\n\nIf you receive this message, your email settings are properly configured.",
      isHtml: false as boolean, // Default to plain text
    },
  });

  const handleConnectionTest = async () => {
    try {
      const result = await testConnection();
      if (result && onTestResult) {
        onTestResult(result);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
    }
  };

  const onSubmit = async (data: TestEmailFormType) => {
    try {
      const result = await sendTest(data);
      if (result && onTestResult) {
        onTestResult(result);
      }
    } catch (error) {
      console.error("Email test failed:", error);
    }
  };

  const renderTestResult = (result: EmailTestResult) => {
    if (!result) return null;

    const isSuccess = result.success;
    const Icon = isSuccess ? CheckCircle : XCircle;
    const bgColor = isSuccess ? "bg-green-50" : "bg-red-50";
    const textColor = isSuccess ? "text-green-800" : "text-red-800";
    const borderColor = isSuccess ? "border-green-200" : "border-red-200";

    return (
      <Alert className={`${bgColor} ${borderColor}`}>
        <Icon className={`h-4 w-4 ${textColor}`} />
        <AlertDescription className={textColor}>
          <div className="space-y-2">
            <div className="font-medium">
              {isSuccess ? "Test Successful" : "Test Failed"}
            </div>
            <div>{result.message}</div>

            {result.details && (
              <div className="text-sm space-y-1">
                {result.details.messageId && (
                  <div>
                    Message ID:{" "}
                    <code className="bg-white px-1 rounded">
                      {result.details.messageId}
                    </code>
                  </div>
                )}
                {result.details.duration && (
                  <div>Duration: {result.details.duration}ms</div>
                )}
                {result.details.response && (
                  <div>
                    Response:{" "}
                    <code className="bg-white px-1 rounded">
                      {result.details.response}
                    </code>
                  </div>
                )}
                {result.details.error && (
                  <div className="mt-2">
                    <div className="font-medium">Error Details:</div>
                    <code className="bg-white p-2 rounded block mt-1 text-xs">
                      {result.details.error}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Email Configuration Test
        </CardTitle>
        <CardDescription>
          Test your email configuration to ensure it's working properly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Mode Selection */}
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            type="button"
            variant={testMode === "connection" ? "default" : "outline"}
            onClick={() => setTestMode("connection")}
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Connection Test
          </Button>
          <Button
            size="sm"
            type="button"
            variant={testMode === "email" ? "default" : "outline"}
            onClick={() => setTestMode("email")}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Send Test Email
          </Button>
        </div>

        {/* Connection Test */}
        {testMode === "connection" && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">
                Connection Test
              </h4>
              <p className="text-sm text-blue-800 mb-4">
                This test verifies that the system can connect to your email
                server using the configured settings. It checks authentication,
                server connectivity, and basic configuration without sending any
                emails.
              </p>
              <Button
                size="sm"
                onClick={handleConnectionTest}
                disabled={testing}
                className="w-full"
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <TestTube className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </div>
          </div>
        )}

        {/* Email Test Form */}
        {testMode === "email" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">
                  Send Test Email
                </h4>
                <p className="text-sm text-orange-800 mb-4">
                  This test sends an actual email to verify end-to-end
                  functionality. Make sure your email provider settings are
                  configured and the connection test passed.
                </p>
              </div>

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="test@example.com"
                      />
                    </FormControl>
                    <FormDescription>
                      Email address where the test email will be sent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Test Email Subject" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isHtml"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">HTML Format</FormLabel>
                      <FormDescription>
                        Send email in HTML format instead of plain text
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Enter the test email content..."
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("isHtml")
                        ? "You can use HTML tags for formatting"
                        : "Plain text content for the test email"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="sm"
                type="submit"
                disabled={testing}
                className="w-full"
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </form>
          </Form>
        )}

        {/* Test Result */}
        {testResult && (
          <div className="space-y-4">
            <h4 className="font-medium">Test Result</h4>
            {renderTestResult(testResult)}
          </div>
        )}

        {/* Test Tips */}
        <div className="space-y-3">
          <h4 className="font-medium">Testing Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg bg-gray-50">
              <h5 className="font-medium text-sm mb-1">Connection Test</h5>
              <p className="text-xs text-gray-600">
                Tests server connectivity and authentication without sending
                emails
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-gray-50">
              <h5 className="font-medium text-sm mb-1">Email Test</h5>
              <p className="text-xs text-gray-600">
                Sends actual email to verify complete functionality
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-gray-50">
              <h5 className="font-medium text-sm mb-1">Check Spam Folder</h5>
              <p className="text-xs text-gray-600">
                Test emails might be filtered as spam initially
              </p>
            </div>
            <div className="p-3 border rounded-lg bg-gray-50">
              <h5 className="font-medium text-sm mb-1">DNS Configuration</h5>
              <p className="text-xs text-gray-600">
                Ensure SPF, DKIM, and DMARC records are properly configured
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
