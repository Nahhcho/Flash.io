import { ALLOWED_FILES } from "@/constants/allowedFileTypes";
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

export const CreateCourseHookForm = z.object({
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
      message: "At most 5 valid files (PDF, DOCX, PPTX, TXT, or CSV)"
    }).optional(),

  url: z.string().url({ message: "Invalid URL" }).optional(),
});

export const CreateSetHookForm = z.object({
    title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must be at most 50 characters" }),

    materials: z
      .custom<FileList>((files): files is FileList => {
        if (!files) return false;

        if (!(files instanceof FileList)) return false;

        const fileArray = Array.from(files);

        const allValidTypes = fileArray.every((file) => {
          const ext = file.name.split(".").pop()?.toLowerCase();
          return ext && ALLOWED_FILES.includes(ext as AllowedFileExtension);
        });

        return allValidTypes && fileArray.length <= 5 && fileArray.length > 0;
      }, {
        message: "You must upload at least 1 and at most 5 valid files (PDF, DOCX, PPTX, TXT, or CSV)."
      }),
    url: z.string().url({ message: "Invalid URL" }).optional(),
})

export const CreateExamSetHookForm = z.object({
    title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must be at most 50 characters" }),

    materials: z
      .custom<FileList>((files): files is FileList => {
        if (!files) return false;

        if (!(files instanceof FileList)) return false;

        const fileArray = Array.from(files);

        const allValidTypes = fileArray.every((file) => {
          const ext = file.name.split(".").pop()?.toLowerCase();
          return ext && ALLOWED_FILES.includes(ext as AllowedFileExtension);
        });

        return allValidTypes && fileArray.length <= 5 && fileArray.length > 0;
      }, {
        message: "You must upload at least 1 and at most 5 valid files (PDF, DOCX, PPTX, TXT, or CSV)."
      }),
    url: z.string().url({ message: "Invalid URL" }).optional(),
    additionalSets: z.string().min(1, { message: "No materials found with set"}).optional(),
    examDate: z
      .preprocess(
        (val) => (val ? new Date(val as string) : undefined),
        z.date().refine((date) => date > new Date(), {
          message: "Future exam date must be provided",
        })
      )
})

export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email({ message: "Email is required"}),
    img: z.string().url({ message: "Please provide a valid URL"}).optional(),
})


const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MaterialSchemaBeforeCreate = z.object({
    name: z.string().min(1),
    url: z.string().url({message: "Please provide a valid url"}).optional(),
    parsedText: z.string().min(1, { message: "No text was parsed"}),
    size: z.number().max(MAX_FILE_SIZE, { message: "File cannot exceed 10 MB" }).optional()
})

export const MaterialSchemaAfterCreate = z.object({
    name: z.string().min(1),
    url: z.string().url({message: "Please provide a valid url"}).optional(),
    parsedText: z.string().min(1, { message: "No text was parsed"}),
    courseId: z.string().min(1, { message: "Course ID is required"}),
    size: z.number().max(MAX_FILE_SIZE, { message: "File cannot exceed 10 MB" })
})

export const CourseSchema = z.object({
    courseId: z.string().min(1, { message: "Course Id required"}).optional(),
    title: z.string().min(1, { message: "Title Required"}).max(50, { message: "Title cannot exceed 50 characters"}),
    userId: z.string().min(1, { message: "User id required"})
})

export const CreateCourseSchema = z.object({
    course: CourseSchema,
    materials: z.array(MaterialSchemaBeforeCreate).optional(),
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
});

export const FlashcardSetSchema = z.object({
  title: z.string().min(1, { message: "Title is required"}).optional(),
  courseId: z.string().min(1, { message: "CourseId is required"}),
  type: z.enum(["Exam", "Regular"], {message: "Improper type"}),
  terms: z.number().min(1, {message: "Number of terms required"}).optional(),
});

export const FlashcardSchema = z.object({
  question: z.string().min(1, { message: "Question required"}),
  answer: z.string().min(1, { message: "Answer required"})
});

export const EditFlashcardsSchema = z.object({
  flashcards: z.array(
    z.object({
      _id: z.string(),
      question: z.string().min(1, { message: "Term required "}),
      answer: z.string().min(1, { message: "Definition required"}),
    })
  )
})

export const StudyPlanSchema = z.object({
  title: z.string().min(1, { message: "Title is required "}).max(50, { message: "Title cannot excced 50 characters" }),
  courseId: z.string().min(1, { message: "courseId is required "}),
  examDate: z
  .preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().refine((date) => date > new Date(), {
      message: "Future exam date must be provided",
    })
  ),
  materials: z.any()
  
})