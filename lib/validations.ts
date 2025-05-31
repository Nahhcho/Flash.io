import { ALLOWED_FILES } from "@/constants/allowedFileTypes";
import { z } from "zod";

export const SignInWithoAuthSchema = z.object({
  provider: z.enum(["google"]),
  proivderAccountId: z.string().min(1, { message: "Provider Account ID is requires"}),
  user: z.object({
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email({message: "Email is required"}),
    username: z.string().min(3, "Username must be at least 3 characters long").optional(),
    img: z.string().url({message: "Invalid url"}).optional(),
  })
})

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email"}),
  name: z.string().min(1, {message: "Please provide your name"}).max(50, {message: "Name cannot exceed 50 charcters"}),
  password: z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(100, { message: "Password cannot exceed 100 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match"
})

export const SignInSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email" }),
  password: z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(100, { message: "Password cannot exceed 100 characters." })
})

export const CreateCourseWithMaterialsSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(30),
  userId: z.string().length(24).regex(/^[0-9a-fA-F]+$/, { message: "Invalid userId format" }),

  materials: z
    .custom<FileList>()
    .refine(
      (files) =>
        !files ||
        Array.from(files).every((file) => {
          const ext = file.name.split(".").pop()?.toLowerCase() as typeof ALLOWED_FILES[number];
          return ext && ALLOWED_FILES.includes(ext);
        }),
      { message: "Only PDF, DOCX, PPTX, TXT, or CSV files are allowed." }
    )
    .optional(),

  url: z.string().url().optional(), // Only needed if user pastes a URL
});

export const AddFlashcardSetSchemea = z.object({
    title: z.string().min(1).max(30).optional(),
    materials: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/).optional())
})

export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email({ message: "Email is required"}),
    img: z.string().url({ message: "Please provide a valid URL"}).optional(),
})

export const MaterialSchemaBeforeParsing = z.object({
    materialName: z.string().min(1),
    url: z.string().url({message: "Please provide a valid url"}).optional(),
    fileType: z.enum(ALLOWED_FILES).optional()
})

export const MaterialSchemaAfterParsing = z.object({
    materialName: z.string().min(1),
    url: z.string().url({message: "Please provide a valid url"}).optional(),
    courseId: z.string().length(24).regex(/^[0-9a-fA-F]+$/, { message: "Invalid userId format" }),
    fileType: z.enum(ALLOWED_FILES).optional(),
    parsedText: z.string().min(1, { message: "No text was parsed"})
})

export const CourseSchema = z.object({
    title: z.string().min(1).max(30),
    userId: z.string().length(24).regex(/^[0-9a-fA-F]+$/, { message: "Invalid userId format" })
})

export const CreateCourseSchema = z.object({
    course: CourseSchema,
    materials: z.array(MaterialSchemaBeforeParsing).optional(),
})