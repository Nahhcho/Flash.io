"use server";

import { ErrorResponse, SuccessResponse } from "@/types/global";
import Course from "@/database/course.model";
import { auth } from "@/auth";
import handlerError from "../handlers/error";
import dbconnect from "../mongoose";
import { CourseSchema, CreateCourseHookForm } from "../validations";
import { NotFoundError, ValidationError } from "../http-errors";
import mongoose from "mongoose";
import FlashcardSet from "@/database/flashcard-set.model";
import Flashcard from "@/database/flashcard.model";
import { revalidatePath } from "next/cache";
import { parseMaterials } from "../parsers/parse-materials";
import { redirect } from "next/navigation";

interface CreateCourseProps {
    title: string,
    materials: FileList;
}

export async function CreateCourse({
    title,
    materials
}: CreateCourseProps) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();
    let courseId;

    try {
        const validatedData = CreateCourseHookForm.partial().safeParse({
            title,
        });

        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const userSession = await auth();
        if (!userSession || !userSession.user) throw new NotFoundError("User session");

        const userId = userSession.user.id!;

        const [course] = await Course.create([{
            title,
            userId: userId.toString()
        }], { session });

        if (materials.length > 0) {
            await parseMaterials({
                files: [...materials],
                courseId: course._id.toString(),
                setType: "Regular",
                session,
            });
        }

        await session.commitTransaction();

        revalidatePath("/");
        courseId = course._id.toString();
        
    } catch (error) {
        await session.abortTransaction();
        console.log(
            "Error within create course server action: ",
            error
        );
        return handlerError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
    redirect(`/courseDetails/${courseId.toString()}`);
}

export async function deleteCourse(courseId: string) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {

        if (!courseId) throw new NotFoundError("courseId");

        await Course.findByIdAndDelete(courseId, { session });

        const sets = await FlashcardSet.find({ courseId }, null, { session });

        for (const set of sets) {
            await Flashcard.deleteMany({ setId: set._id }, { session })
        }
        
        await FlashcardSet.deleteMany({ courseId }, { session });

        session.commitTransaction();

        revalidatePath("/");

    } catch (error) {
        await session.abortTransaction();
        console.log("Error before handler", error)
        console.log("Error after handler", handlerError(error))
        return handlerError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
    redirect("/")
}

export async function updateCourseName(title: string, courseId: string) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const validatedData = CourseSchema.partial().safeParse({title, courseId});

        if (!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const course = await Course.findByIdAndUpdate(courseId, { title }, { new: true, runValidators: true, session });

        await session.commitTransaction();

        return { status: 201, success: true, data: course };
               
    } catch (error) {
        await session.abortTransaction();
        return handlerError(error, 'server') as ErrorResponse;
    } finally {
        session.endSession();
    }
}