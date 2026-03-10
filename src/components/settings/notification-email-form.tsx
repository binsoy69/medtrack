"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationEmailSchema,
  type NotificationEmailFormData,
} from "@/lib/validators/settings";
import { updateNotificationEmail } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface NotificationEmailFormProps {
  currentEmail: string | null;
}

export function NotificationEmailForm({
  currentEmail,
}: NotificationEmailFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NotificationEmailFormData>({
    resolver: zodResolver(notificationEmailSchema),
    defaultValues: { email: currentEmail ?? "" },
  });

  const onSubmit = async (data: NotificationEmailFormData) => {
    setServerError(null);
    setSuccess(false);

    const result = await updateNotificationEmail(data.email || null);
    if (result?.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  };

  const handleClear = async () => {
    setServerError(null);
    setSuccess(false);
    setValue("email", "");

    const result = await updateNotificationEmail(null);
    if (result?.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {serverError}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Notification email updated successfully.
        </div>
      )}

      <FormField label="Notification Email" error={errors.email?.message}>
        <Input
          type="email"
          {...register("email")}
          placeholder="your@email.com"
          error={errors.email?.message}
        />
      </FormField>

      <p className="text-xs text-slate-500">
        You&apos;ll receive a daily email when any medication is low in stock.
      </p>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
          Save Email
        </Button>
      </div>
    </form>
  );
}
