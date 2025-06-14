import Course, { ICourseDoc } from "@/database/course.model";
import StudyPlan, { IStudyPlanDoc } from "@/database/study-plan.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{userId: string}>}) {
    console.log("GET study plans hit")
    await dbconnect();
    
    try {
        const { userId } = await params;
        
        if (!userId) throw new NotFoundError("userId");

        const courses: ICourseDoc[] = await Course.find({userId});

        const studyPlans: IStudyPlanDoc[] = [];

        for (const course of courses) {
            const plans = await StudyPlan.find({courseId: course._id});
            if (plans) studyPlans.push(...plans);
        }

        return NextResponse.json({success: true, data: studyPlans}, {status: 200});
 
    } catch (error) {
        console.log("Error from users GET study plans api: ", error)
        return handlerError(error, "api") as APIErrorResponse;
    }
}