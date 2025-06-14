import Course from "@/database/course.model";
import FlashcardSet, { IFlashcardSetDoc } from "@/database/flashcard-set.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: 
    { params: Promise<{ userId: string}>}
) {
    await dbconnect();

    try {
        const { userId } = await params;

        if (!userId) throw new NotFoundError("userId");

        const courses = await Course.find({ userId });

        const examSets: IFlashcardSetDoc[] = (await Promise.all(
            courses.map(async (course) => {
                return await FlashcardSet.find({
                    courseId: course._id
                })
            })
        )).flat()

        return NextResponse.json({ success: true, data: examSets, status: 200 });

    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }

}