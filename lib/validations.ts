import { ALLOWED_FILES, ALLOWED_MIME_TYPES } from "@/constants/allowedFileTypes";
import { z } from "zod";

export const SignInWithoAuthSchema = z.object({
    userInfo: z.object({
      name: z.string().min(1, { message: "Name is required"}),
      email: z.string().email({message: "Email is required"}),
      image: z.string().url({message: "Invalid url"}).optional(),
  }),
  provider: z.enum(["google"]),
  providerAccountId: z.string().min(1, { message: "Provider Account ID is required"}),
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


// Get the union type from the array (e.g., "pdf" | "docx" | ...)
type AllowedFileExtension = typeof ALLOWED_FILES[number];

export const CreateCourseWithMaterialsSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must be at most 50 characters" }),

  materials: z
    .custom<FileList>((files): files is FileList => {
      if (!files) return true;

      if (!(files instanceof FileList)) return false;

      const fileArray = Array.from(files);

      const allValidTypes = fileArray.every((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return ext && ALLOWED_FILES.includes(ext as AllowedFileExtension);
      });

      return allValidTypes && fileArray.length <= 5;
    }, {
      message: "Only PDF, DOCX, PPTX, TXT, or CSV files are allowed (max 5 files)."
    })
    .optional(),

  url: z.string().url({ message: "Invalid URL" }).optional(),
});


export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email({ message: "Email is required"}),
    img: z.string().url({ message: "Please provide a valid URL"}).optional(),
})

export const MaterialSchemaBeforeParsing = z.object({
    name: z.string().min(1, { message: "Name is required"}),
    url: z.string().url({message: "Please provide a valid url"}).optional(),
    type: z.enum(ALLOWED_MIME_TYPES).optional(),
    size: z.number().optional()
})

export const MaterialSchemaAfterParsing = z.object({
    materialName: z.string().min(1),
    url: z.string().url({message: "Please provide a valid url"}).optional(),
    courseId: z.string().length(24).regex(/^[0-9a-fA-F]+$/, { message: "Invalid userId format" }),
    fileType: z.enum(ALLOWED_FILES).optional(),
    parsedText: z.string().min(1, { message: "No text was parsed"})
})

export const CourseSchema = z.object({
    title: z.string().min(1, { message: "Title Required"}).max(50, { message: "Title cannot exceed 50 characters"}),
    userId: z.string().min(1, { message: "User id required"})
})

export const CreateCourseSchema = z.object({
    course: CourseSchema,
    materials: z.array(MaterialSchemaBeforeParsing).optional(),
})

export const AccountSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Please provide a valid email"
  }),
  provider: z.enum(["google"]),
  providerAccountId: z.string(),
  userId: z.string(),
  image: z.string().url({
    message: "Please provide a valid url"
  }).optional()
})