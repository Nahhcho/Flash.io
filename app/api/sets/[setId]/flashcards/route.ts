import FlashcardSet from "@/database/flashcard-set.model";
import Flashcard from "@/database/flashcard.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ setId: string }>}) {
    console.log("GET FLASHCARD HIT")
    const { setId } = await params;

    try {
        
        await dbconnect(); 

        if (!setId) throw new NotFoundError("setId");

        const flashcards = await Flashcard.find({ setId });
        const set = await FlashcardSet.findById(setId);

        return NextResponse.json({ success: true, data: { set, flashcards } }, { status: 200 });
    } catch (error) {
        console.log("ERROR?!?!?: ", error)
        return handlerError(error, "api") as APIErrorResponse;
    }
}