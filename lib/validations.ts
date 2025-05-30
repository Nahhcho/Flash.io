import { z } from "zod";


export const AddCourseSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(30),
    materials: z
    .custom<FileList>()
    .refine(
        (files) => 
            !files ||
            Array.from(files).every((file) => file.type === "application/pdf"),
            { message: "Only PDF files are allowed."}
    ).optional(),
    url: z.string().optional()
})

export const AddFlashcardSetSchemea = z.object({
    title: z.string().min(1).max(30).optional(),
    materials: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/).optional())
})

export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email({ message: "Email is required"}),
    img: z.string().url({ message: "Please provide a valid URL"}).optional(),
})

export const CourseSchema = z.object({
    title: z.string().min(1, { message: "Title is required"}),
    userId: z.string().min(1, "User id is required")
})

export const MaterialMetaSchema = z.object({
    name: z.string(),
    type: z.string().startsWith("application/pdf"),
    size: z.number().positive().max(10*1024*1024),
    path: z.string().startsWith("/uploads/"),
})

export const AddCourseMetaSchema = z.object({
    title: z.string().min(1).max(30),
    materials: z.array(MaterialMetaSchema).optional()
})