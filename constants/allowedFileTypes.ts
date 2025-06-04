export const ALLOWED_FILES = [
    "pdf",
    "docx",
    "pptx",
    "txt",
    "csv"
] as const

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "text/plain",
  "text/csv"
] as const;

export type AllowedFileTypes = typeof ALLOWED_FILES[number]

//TODO: File size and upload limit