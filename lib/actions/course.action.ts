"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import { api } from "../api";
import Course, { ICourseDoc } from "@/database/course.model";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";
import handlerError from "../handlers/error";
import dbconnect from "../mongoose";
import { CourseSchema } from "../validations";
import { NotFoundError, ValidationError } from "../http-errors";
import mongoose from "mongoose";
import FlashcardSet from "@/database/flashcard-set.model";
import Flashcard from "@/database/flashcard.model";
import { revalidatePath } from "next/cache";

export async function CreateCourse<T extends {title: string, materials?: FileList }>(data: T) {
    const formData = new FormData();
    const { title, materials } = data;

    const session = await auth();
    
    if (!session) redirect(ROUTES.SIGN_IN);

    const userId = session.user!.id!;

    formData.append("title", title);

    if (materials) {
        Array.from(materials).forEach((file) => {
            formData.append("materials", file);
        });
    }

    const response = (await api.courses.create(formData, userId)) as ActionResponse<ICourseDoc>;

    if (!response.success || !response.data) return response as ErrorResponse;
    
    const courseId = response.data._id;
    
    console.log("redirect now: ", response.success)
    redirect(`/courseDetails/${courseId}`);
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

        return { status: 204, success: true, data: null }
    } catch (error) {
        await session.abortTransaction();
        return handlerError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }

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