import StudyPlan, { IStudyPlanDoc } from "@/database/study-plan.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{courseId: string}>}) {
    await dbconnect();

    try {
        const { courseId } = await params;

        if (!courseId) throw new NotFoundError("courseId");

        const studyPlans: IStudyPlanDoc[] = await StudyPlan.find({courseId});

        return NextResponse.json({success: true, data: studyPlans, status: 200});

    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }
}