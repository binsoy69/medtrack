import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export type UsernameFormData = z.infer<typeof usernameSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const timezoneSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
});

export type TimezoneFormData = z.infer<typeof timezoneSchema>;

export const notificationEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
});

export type NotificationEmailFormData = z.infer<typeof notificationEmailSchema>;
