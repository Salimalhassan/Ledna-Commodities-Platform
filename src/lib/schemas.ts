
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  userType: z.enum(['seller', 'buyer'], { required_error: "Please select your role." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const UserProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  verificationType: z.enum(["NIN", "Passport", ""]).optional(),
  verificationNumber: z.string().optional(),
});

export const CommodityUploadSchema = z.object({
  name: z.string().min(3, { message: "Commodity name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  categoryId: z.string({ required_error: "Please select a category." }),
  price: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive({ message: "Price must be a positive number." })
  ),
  unit: z.string().min(1, { message: "Unit is required (e.g., kg, piece)." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  sellerContact: z.string().optional(),
  location: z.string().optional(),
  externalLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});
