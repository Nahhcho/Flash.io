import FlashcardSet from "@/database/flashcard-set.model";
import { ClientSession, Types } from "mongoose";
import { FlashcardSetSchema, MaterialSchemaBeforeCreate } from "../validations";
import { NotFoundError, ValidationError } from "../http-errors";
import Material from "@/database/material.model";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { gptTextToFlashCards } from "./parse-gpt-text";
import { flashcardGenPrompt } from "@/constants/flashcardGenPrompt";
import mongoose from "mongoose";

interface ParseMaterialsProps {
    files: File[];
    courseId: string;
    setType: "Exam" | "Regular";
    session: ClientSession;
    passedTitle?: string;
    studyPlanId?: Types.ObjectId;
}

export async function parseMaterials({
    files,
    courseId,
    setType = "Regular",
    session,
    passedTitle = undefined,
    studyPlanId = undefined,
}: ParseMaterialsProps) {
    try {
        console.log("Parse Materials function reached.")
        if (files.length < 1) throw new Error("Files required");
        console.log("Parse Materials Hit")

        const mammoth = (await import("mammoth")).default;
        const path = await import("path");
        
        let validatedSetData;
        if (passedTitle) {
            validatedSetData = FlashcardSetSchema.safeParse({
                title: passedTitle,
                courseId,
                type: setType
            })
        } else {
            validatedSetData = FlashcardSetSchema.safeParse({
                courseId,
                type: setType
            })
        }
    
        if (!validatedSetData.success) {
            throw new ValidationError(validatedSetData.error.flatten().fieldErrors);
        }
        
        const [flashCardSet] = await FlashcardSet.create([{
            courseId,
            studyPlanId: setType === "Exam" ? new mongoose.Types.ObjectId(studyPlanId) : undefined,
            type: setType,
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

        console.log("Text extraction finished")
    
        fileList.map(async (file) => {
            const validatedFile = MaterialSchemaBeforeCreate.safeParse(file);
            if (!validatedFile.success) throw new ValidationError(validatedFile.error.flatten().fieldErrors);
    
            const data = validatedFile.data;
            const [material] = await Material.create([{
                ...data,
                setId: flashCardSet.id,
                courseId
            }], { session })
            return material
        })
    
        const prompt = flashcardGenPrompt(extractedText);
    
        console.log("gpt reached, Prompt: ", prompt);
        const { text: gptText } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt
        })

        console.log("gpt finished");
        const { terms, title } = await gptTextToFlashCards({
            gptText,
            session,
            setId: flashCardSet.id
        });
    
        flashCardSet.title = passedTitle ? passedTitle : title;
        flashCardSet.terms = terms;
        await flashCardSet.save({session});

        console.log("flashcards creation finished")
        return flashCardSet;
        
    } catch (error) {
        console.log("Error while parsing materials: ", error);
        throw error;
    }

}