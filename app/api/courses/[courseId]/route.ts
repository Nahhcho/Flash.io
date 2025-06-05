import Course from "@/database/course.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { CourseSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(_:Request, { params }: { params: Promise<{courseId: string}>}) {
    console.log("GET COURSE HIT");
    const { courseId } = await params;
    
    try {
        if (!courseId) throw new NotFoundError("courseId");

        const validatedId = CourseSchema.partial().safeParse({ courseId });

        if (!validatedId.success) throw new ValidationError(validatedId.error.flatten().fieldErrors);

        await dbconnect();

        const course = await Course.findById(courseId);

        return NextResponse.json({ success: true, data: course }, { status: 200 });
    } catch (error) {
        console.log(error);
        return handlerError(error, "api") as APIErrorResponse;
    }
    
}