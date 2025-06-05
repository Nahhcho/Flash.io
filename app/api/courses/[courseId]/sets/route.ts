import FlashcardSet from "@/database/flashcard-set.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ courseId: string }>}) {
    try {
        await dbconnect();

        const { courseId } = await params;

        if (!courseId) throw new NotFoundError("courseId");

        const sets = await FlashcardSet.find({ courseId });

        return NextResponse.json({ success: true, data: sets }, { status: 200 })
    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }
}