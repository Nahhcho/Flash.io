import FlashcardSet from "@/database/flashcard-set.model";
import { ClientSession } from "mongoose";
import { FlashcardSetSchema, MaterialSchemaBeforeCreate } from "../validations";
import { NotFoundError, ValidationError } from "../http-errors";
import Material from "@/database/material.model";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { gptTextToFlashCards } from "./parse-gpt-text";
import handlerError from "../handlers/error";
import { APIErrorResponse } from "@/types/global";

export async function parseMaterials(
    files: File[],
    courseId: string,
    setType: "Exam" | "Regular" = "Regular",
    session: ClientSession
) {
    try {
        const mammoth = (await import("mammoth")).default;
        const path = await import("path");
        
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
    
        
    
        let extractedText = ""
        const fileList = await Promise.all(
            files.map(async (file) => {
                if (!file) throw new NotFoundError("file");
                
                const ext = path.extname(file.name!).toLowerCase();
                const buffer = Buffer.from(await file.arrayBuffer());
                let parsedText = "";
    
                switch (ext) {
                    case ".txt":
                        parsedText = buffer.toString();
                        break; 
    
                    case ".pdf":
                        const pdfParse = (await import("pdf-parse")).default;
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
                    name: file.name,
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
    
        console.log("Material List: ", materialList);
    
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
        
    } catch (error) {
        console.log(error);
        throw handlerError(error, 'api') as APIErrorResponse;
    }

}