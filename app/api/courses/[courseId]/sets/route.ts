import FlashcardSet from "@/database/flashcard-set.model";
import handlerError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { FlashcardSchema } from "@/lib/validations";
import { parseMaterials } from "@/lib/parsers/parse-materials";

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

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }>}) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { courseId } = await params;

        if (!courseId) throw new NotFoundError("courseId");

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const files = formData.getAll("materials") as File[];

        if (!title) throw new NotFoundError("title");
        
        if (!files) throw new NotFoundError("files/materials");

        const validatedData = FlashcardSchema.safeParse({
            courseId,
            type: "Regular",
            title
        });

        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const set = await parseMaterials(files, courseId, "Regular", session, title);

        await session.commitTransaction();

        return NextResponse.json({ success: true, data: set }, { status: 200 })
    } catch (error) {  
        await session.abortTransaction();

        return handlerError(error, "api") as APIErrorResponse;
    }
}