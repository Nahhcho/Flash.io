import FlashcardSet from "@/database/flashcard-set.model";
import handlerError from "@/lib/handlers/error"
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global"
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ setId: string }>}) {
    const { setId } = await params

    try {
        await dbconnect();

        if (!setId) throw new NotFoundError("SetId");

        const set = await FlashcardSet.findById(setId);

        return NextResponse.json({ success: true, data: set }, { status: 200 });
    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }
}