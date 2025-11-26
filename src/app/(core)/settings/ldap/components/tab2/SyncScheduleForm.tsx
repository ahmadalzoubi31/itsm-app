"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { SyncSettings } from "../../types";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FREQUENCIES,
  DAYS_OF_WEEK,
  DAYS_OF_MONTH,
  MINUTES,
  FrequencyEnum,
} from "../../constants/frequency.constant";
import { TIMEZONES } from "../../constants/timezone.constant";

interface SyncScheduleFormProps {
  form: UseFormReturn<SyncSettings>;
  onSave: (values: SyncSettings) => void;
  isSaving?: boolean;
}

export function SyncScheduleForm({
  form,
  onSave,
  isSaving = false,
}: SyncScheduleFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave, (errors) => {
          console.error("Form validation errors:", errors);
          // Form validation will show errors via FormMessage components
        })}
        className="space-y-6"
        autoComplete="off"
      >
        <Card>
          <CardHeader className="border-b border-gray-200 ">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <RotateCcw className="w-5 h-5 text-primary" />
              Schedule Configuration
            </CardTitle>
            <CardDescription>
              Configure automatic synchronization schedule and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-1">
                    <FormLabel className="text-gray-900 font-medium">
                      Enable Automatic Sync
                    </FormLabel>
                    <FormDescription>
                      Automatically synchronize users based on the schedule
                      below
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sync Frequency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!form.watch("enabled") || isSaving}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {FREQUENCIES.map((frequency) => (
                            <SelectItem
                              key={frequency.value}
                              value={frequency.value}
                            >
                              {frequency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional fields based on frequency */}
              {form.watch("frequency") === FrequencyEnum.HOURLY && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="syncMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sync at Minute</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            disabled={!form.watch("enabled") || isSaving}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Minute" />
                            </SelectTrigger>
                            <SelectContent>
                              {MINUTES.map((minute) => (
                                <SelectItem
                                  key={minute.value}
                                  value={minute.value.toString()}
                                >
                                  {minute.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!form.watch("enabled") || isSaving}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIMEZONES.map((timezone) => (
                                <SelectItem
                                  key={timezone.value}
                                  value={timezone.value}
                                >
                                  {timezone.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {form.watch("frequency") === FrequencyEnum.DAILY && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="syncTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sync Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            disabled={!form.watch("enabled") || isSaving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!form.watch("enabled") || isSaving}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIMEZONES.map((timezone) => (
                                <SelectItem
                                  key={timezone.value}
                                  value={timezone.value}
                                >
                                  {timezone.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {form.watch("frequency") === FrequencyEnum.WEEKLY && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="daysOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days of Week</FormLabel>
                        <FormDescription>
                          Select one or more days when sync should run
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {DAYS_OF_WEEK.map((day) => (
                            <div
                              key={day.value}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`day-${day.value}`}
                                checked={
                                  field.value?.includes(day.value) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValues,
                                      day.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (v) => v !== day.value
                                      )
                                    );
                                  }
                                }}
                                disabled={!form.watch("enabled") || isSaving}
                              />
                              <label
                                htmlFor={`day-${day.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {day.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="syncTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sync Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              disabled={!form.watch("enabled") || isSaving}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!form.watch("enabled") || isSaving}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIMEZONES.map((timezone) => (
                                  <SelectItem
                                    key={timezone.value}
                                    value={timezone.value}
                                  >
                                    {timezone.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {form.watch("frequency") === FrequencyEnum.MONTHLY && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="daysOfMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days of Month</FormLabel>
                        <FormDescription>
                          Select one or more days of the month when sync should
                          run
                        </FormDescription>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                          {DAYS_OF_MONTH.map((day) => (
                            <div
                              key={day.value}
                              className="flex items-center space-x-1"
                            >
                              <Checkbox
                                id={`month-day-${day.value}`}
                                checked={
                                  field.value?.includes(day.value) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValues,
                                      day.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (v) => v !== day.value
                                      )
                                    );
                                  }
                                }}
                                disabled={!form.watch("enabled") || isSaving}
                              />
                              <label
                                htmlFor={`month-day-${day.value}`}
                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {day.value}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="syncTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sync Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              disabled={!form.watch("enabled") || isSaving}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!form.watch("enabled") || isSaving}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIMEZONES.map((timezone) => (
                                  <SelectItem
                                    key={timezone.value}
                                    value={timezone.value}
                                  >
                                    {timezone.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="retryAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retry Attempts</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        disabled={!form.watch("enabled") || isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retryInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retry Interval (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        max={120}
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        disabled={!form.watch("enabled") || isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullSyncInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Sync Interval (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        disabled={!form.watch("enabled") || isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <Separator />
          <div className="flex justify-end px-4 lg:px-8">
            <Button
              size="sm"
              type="submit"
              size="sm"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}

export default SyncScheduleForm;
