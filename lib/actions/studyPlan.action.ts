"use server";

import StudyPlan from "@/database/study-plan.model";
import dbconnect from "../mongoose";
import mongoose from "mongoose"
import handlerError from "../handlers/error";
import { ErrorResponse } from "@/types/global";
import { StudyPlanSchema } from "../validations";
import { ValidationError } from "../http-errors";
import { parseMaterials } from "../parsers/parse-materials";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toLocalMidnight } from "../utils/dateLogic";

type Props = {
    title: string,
    materials: FileList,
    examDate: Date,
    courseId: string,
}

export async function CreateStudyPlan({ title, materials, examDate, courseId }: Props) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("Study plan hit");
        console.log("materials: ", materials)
        const validatedData = StudyPlanSchema.safeParse({ title, materials, examDate, courseId });

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        }

        const [studyPlan] = await StudyPlan.create([{
            title,
            courseId,
            examDate: toLocalMidnight(examDate),
            startDate: toLocalMidnight(new Date()),
        }], { session });

        const setTitle = title + " Review 1"
        const firstExamSet = await parseMaterials({
            files: [...materials],
            courseId,
            setType: "Exam",
            session,
            passedTitle: setTitle,
            studyPlanId: studyPlan._id,
        });
        firstExamSet.dueDate = toLocalMidnight(new Date());
        await firstExamSet.save({session});

        await session.commitTransaction();

        
    } catch (error) {
        await session.abortTransaction();
        console.log(error)
        
        return handlerError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
    revalidatePath("/");
    redirect("/")
}