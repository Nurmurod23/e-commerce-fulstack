import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const checkoutSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),
  postalCode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format (e.g., 12345 or 12345-6789)"),
  country: z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country cannot exceed 100 characters"),
});