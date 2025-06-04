import Course from "@/database/course.model";
import handlerError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { CourseSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: Promise<{ userId: string }>}) {
    console.log("API HIT")
    const { userId } = await params;
    if (!userId) throw new Error("No user id");

    try {
        await dbconnect();
        
        const validatedData = CourseSchema.partial().safeParse({ userId });

        if (!validatedData.success) { 
            console.log("ZOD ERROR")
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        }
        console.log(validatedData.success)
        const courses = await Course.find({ userId }) 
        console.log(courses)

        return NextResponse.json({ success: true, data: courses}, { status: 200})
    } catch (error) {
        console.log("ERROR CAUGHT")
        return handlerError(error, "api") as APIErrorResponse;
    }
}
