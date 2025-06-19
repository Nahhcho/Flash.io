import StudyPlan, { IStudyPlanDoc } from "@/database/study-plan.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ studyPlanId: string }>}) {
    const { studyPlanId } = await params;
    await dbconnect();
    try {
        if (!studyPlanId) return new NotFoundError("studyPlanId");
        const studyPlan = await StudyPlan.findById(studyPlanId);

        return NextResponse.json({ success: true, data: studyPlan }, { status: 200 });
    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }
}