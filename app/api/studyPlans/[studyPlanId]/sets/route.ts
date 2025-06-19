import FlashcardSet from "@/database/flashcard-set.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_:Request, {params}: {params:Promise<{studyPlanId: string}>}) {
    await dbconnect();
    const { studyPlanId } = await params;

    try {
        if (!studyPlanId) throw new NotFoundError("studyPlanId");

        const sets = await FlashcardSet.find({ studyPlanId });

        return NextResponse.json({ success: true, data: sets }, { status: 200 });
    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }
}