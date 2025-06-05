import FlashcardSet from "@/database/flashcard-set.model";
import { File, Files } from "formidable";
import { ClientSession } from "mongoose";
import { FlashcardSetSchema, MaterialSchemaBeforeCreate } from "../validations";
import { NotFoundError, ValidationError } from "../http-errors";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import path from "path";
import fs from "fs/promises";
import Material from "@/database/material.model";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { gptTextToFlashCards } from "./parse-gpt-text";

export async function parseMaterials(
    files: Files,
    courseId: string,
    setType: "Exam" | "Regular" = "Regular",
    session: ClientSession
) {
    
    const validatedSetData = FlashcardSetSchema.safeParse({
        courseId,
        type: setType
    })

    if (!validatedSetData.success) {
        throw new ValidationError(validatedSetData.error.flatten().fieldErrors);
    }

    const [flashCardSet] = await FlashcardSet.create([{
        courseId,
        type: setType
    }], { session })

    

    const uploadedFiles = Array.isArray(files.materials)
    ? files.materials : [files.materials];

    let extractedText = ""
    const fileList = await Promise.all(
        uploadedFiles.map(async (file) => {
            if (!file) throw new NotFoundError("file");
            
            const ext = path.extname(file.originalFilename!).toLocaleLowerCase();
            const buffer = await fs.readFile(file.filepath);
            let parsedText = "";

            switch (ext) {
                case ".txt":
                    parsedText = buffer.toString();
                    break;

                case ".pdf":
                    parsedText = (await pdfParse(buffer)).text
                    break;

                case ".docx":
                    parsedText = (await mammoth.extractRawText({ buffer })).value;
                    break;
                
                case ".csv":
                    parsedText = buffer.toString();
                    break;
            }

            extractedText += parsedText;

            return ({
                name: file.originalFilename,
                parsedText,
                size: file.size
            })
        })
    )

    const materialList = await Promise.all(fileList.map(async (file) => {
        const validatedFile = MaterialSchemaBeforeCreate.safeParse(file);
        if (!validatedFile.success) throw new ValidationError(validatedFile.error.flatten().fieldErrors);

        const data = validatedFile.data;
        const [material] = await Material.create([{
            ...data,
            setId: flashCardSet.id,
            courseId
        }], { session })
        return material
    }))

    const { text: gptText } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `From the following educational content, create concise flashcards in the format:\nQ: <question>\nA: <answer>\n\nOnly include accurate, factual questions. Avoid duplicate or overly similar questions.
                 also create a relevant title in the form title: <title> for the entire flashcard set.
                 30 characters for the title MAX.\n\nContent:\n${extractedText}`
    })

    const { terms, title } = await gptTextToFlashCards({
        gptText,
        session,
        setId: flashCardSet.id
    });

    flashCardSet.title = title;
    flashCardSet.terms = terms;
    await flashCardSet.save({session});

}