"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usernameSchema,
  type UsernameFormData,
} from "@/lib/validators/settings";
import { updateUsername } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface ChangeUsernameFormProps {
  currentUsername: string;
}

export function ChangeUsernameForm({
  currentUsername,
}: ChangeUsernameFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: currentUsername },
  });

  const onSubmit = async (data: UsernameFormData) => {
    setServerError(null);
    setSuccess(false);

    if (data.username === currentUsername) {
      setServerError("New username is the same as the current one");
      return;
    }

    const result = await updateUsername(data.username);
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
          Username updated successfully.
        </div>
      )}

      <FormField label="Username" error={errors.username?.message}>
        <Input
          {...register("username")}
          placeholder="Enter new username"
          error={errors.username?.message}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
          Update Username
        </Button>
      </div>
    </form>
  );
}
