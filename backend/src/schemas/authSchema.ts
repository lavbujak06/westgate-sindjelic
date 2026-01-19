import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  captchaToken: z.string().min(1, "Captcha token is required")
}).strict(); 

export const signupSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  captchaToken: z.string().min(1, "Captcha token is required")
}).strict();

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50),
  email: z.string().email("Invalid email format"),
  phone: z.string().max(20).optional().or(z.literal('')),
  category: z.string().min(1, "Category is required"),
  date: z.string().optional().or(z.literal('')),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().max(0, "Bot detected").optional().or(z.literal('')),
}).strict();