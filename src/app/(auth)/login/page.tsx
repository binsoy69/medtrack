"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const result = await signIn(data);

    // signIn redirects on success, so if we execute this block it indicates an error
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          Enter your details to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField label="Username" error={errors.username?.message}>
          <Input
            {...register("username")}
            type="text"
            placeholder="johndoe"
            error={errors.username?.message}
            autoComplete="username"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </FormField>

        {serverError && (
          <div className="p-3 text-sm font-medium text-red-800 bg-red-50 rounded-md">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </Card>
  );
}
