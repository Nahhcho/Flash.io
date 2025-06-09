import Course from "@/database/course.model";
import handlerError from "@/lib/handlers/error"
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose"
import { CourseSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global"
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
    _: Request,
    {
        params
    } :
    {
        params: Promise<{ userId: string }>
    }
) {
    console.log("GET HIT");
    try {
        console.log("GET COURSES API HIT");
        await dbconnect();

        const { userId } = await params;

        if (!userId) {
            console.log("no id")
            throw new NotFoundError("userId");
        }

        const courses = await Course.find({ userId })

        return NextResponse.json({ success: true, data: courses }, { status: 200 });
    } catch (error) {
        console.log("HELLO???")
        return handlerError(error, "api") as APIErrorResponse
    }
}

// export const config = {
//     api: {
//         bodyParser: false
//     }
// };

export async function POST(req: Request, {params}: {params: Promise<{userId: string}>}) {
    const { parseMaterials } = await import("@/lib/parsers/parse-materials");

    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("POST hit")
        const formData = await req.formData();
        const title = formData.get("title");
        const files = formData.getAll("materials") as File[];
        const { userId } = await params;

        if (!(title)) {
            throw new NotFoundError("title");
        }

        if (!(userId)) {
            throw new NotFoundError("userId");
        }

        const validatedData = CourseSchema.safeParse({title, userId});

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        }

        const [course] = await Course.create([{title, userId}], {session});

        if (files) {
            await parseMaterials(
                files,
                course.id,
                "Regular",
                session,
            );
        }

        await session.commitTransaction();

        return NextResponse.json({ success: true, data: course }, { status: 201 });
    } catch (error) {
        await session.abortTransaction();

        return handlerError(error, 'api') as APIErrorResponse;
    }
}

