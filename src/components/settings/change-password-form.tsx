"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordSchema,
  type PasswordFormData,
} from "@/lib/validators/settings";
import { updatePassword } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setServerError(null);
    setSuccess(false);

    const result = await updatePassword(data.currentPassword, data.newPassword);
    if (result?.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
      reset();
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
          Password updated successfully.
        </div>
      )}

      <FormField
        label="Current Password"
        error={errors.currentPassword?.message}
      >
        <Input
          type="password"
          {...register("currentPassword")}
          placeholder="Enter current password"
          error={errors.currentPassword?.message}
        />
      </FormField>

      <FormField label="New Password" error={errors.newPassword?.message}>
        <Input
          type="password"
          {...register("newPassword")}
          placeholder="Enter new password"
          error={errors.newPassword?.message}
        />
      </FormField>

      <FormField
        label="Confirm New Password"
        error={errors.confirmPassword?.message}
      >
        <Input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  );
}
