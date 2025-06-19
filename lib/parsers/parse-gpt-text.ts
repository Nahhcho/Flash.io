import { ClientSession, Types } from "mongoose";
import { FlashcardSchema } from "../validations";
import { ValidationError } from "../http-errors";
import Flashcard from "@/database/flashcard.model";
import handlerError from "../handlers/error";

export async function gptTextToFlashCards({
    gptText,
    session,
    setId,
}: {
    gptText: string, 
    session: ClientSession, 
    setId: Types.ObjectId}): Promise<{terms: number, title: string, currentSetCompletionDate: Date | undefined}> {

        try {
            const lines = gptText
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    
            let title = "";
            let curQ = "";
            let curA = "";
            let terms = 0;
            let currentSetCompletionDate: Date | undefined;
    
            for (const line of lines) {
                if (line.toLowerCase().startsWith("title:")) {
                    title = line.slice(6).trim();
                } else if (line.startsWith("Q:")) {
                    if (curQ && curA) {
                        const validatedData = FlashcardSchema.safeParse({
                            question: curQ,
                            answer: curA,
                            setId
                        });
    
                        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);
                        
                        await Flashcard.create([{
                            question: curQ,
                            answer: curA,
                            setId,
                        }], {session});
                        terms++;
                    }
                    curQ = line.slice(2).trim();
                    curA = ""
                } else if (line.startsWith("A:")) {
                    curA = line.slice(2).trim();
                } else if (line.toLowerCase().startsWith("datetocomplete")) {
                    currentSetCompletionDate = new Date(line.slice(15).trim());
                }
            }
    
            if (curQ && curA) {
                await Flashcard.create([{question: curQ, answer: curA, setId}], {session});
                terms++;
            }
            
            console.log("Due date from parse-gpt-text: ", currentSetCompletionDate)

            return { title, terms, currentSetCompletionDate }
            
        } catch (error) {
            console.log("Error while parsing gpt response: ", handlerError(error, "api"))
            throw error
        }
}