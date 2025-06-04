"server-only";

import PdfParse from "pdf-parse";

export async function parsePdf(file: File) {
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const res = await PdfParse(buffer);
    return res.text
}