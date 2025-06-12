"use server";

import { ErrorResponse } from "@/types/global";
import { api } from "../api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CreateExamSetHookForm } from "../validations";
import dbconnect from "../mongoose";
import mongoose from "mongoose";
import handlerError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { parseMaterials } from "../parsers/parse-materials";
import FlashcardSet, { IFlashcardSetDoc } from "@/database/flashcard-set.model";
import Course, { ICourseDoc } from "@/database/course.model";
import { auth } from "@/auth";
import { getSunSat } from "../utils/dateLogic";
import Flashcard, { IFlashcardDoc } from "@/database/flashcard.model";
import Material, { IMaterialDoc } from "@/database/material.model";
import { focusedFlashcardGenPrompt } from "@/constants/flashcardGenPrompt";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { gptTextToFlashCards } from "../parsers/parse-gpt-text";

export async function CreateSet<T extends {title: string, materials: FileList}>(data: T, courseId: string) {
    const formData = new FormData();
    const { title, materials } = data;

    if (!courseId) console.log("no course id found");

    formData.append("title", title);
    
    Array.from(materials).forEach((file) => {
        formData.append("materials", file);
    });
     
    console.log("Create set server action reached: ", formData)
    const response = (await api.FlashcardSets.createSet(formData, courseId));

    if (!response.success || !response.data) {
        console.log(response)
        return response as ErrorResponse;
    }

    revalidatePath(`/courseDetails/${courseId}`);
    redirect(`/courseDetails/${courseId}`);
}

export async function CreateExamSet<T extends z.infer<typeof CreateExamSetHookForm>>(data: T, courseId: string) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("Exam set post hit: ", data)
        const { title, materials, examDate } = data;
 
        if (!courseId) throw new NotFoundError("courseId");

        console.log("Exam set parse reached")
        const examSet = await parseMaterials([...materials], courseId, "Exam", session, title, examDate);

        await session.commitTransaction();
        revalidatePath(`/courseDetails/${courseId}`)

        return {success: true, data: examSet, status: 201}
    } catch (error) {
        await session.abortTransaction();
        console.log(error)
        return handlerError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export async function iterateExamSet(setId: string, weakIds: string[]) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("creating new Exam set");
    try {
        if (!setId) throw new NotFoundError("setId");

        const weakFlashCards: IFlashcardDoc[] = await Promise.all(weakIds.map(async (id) => {
            const card = await Flashcard.findById(id);
            if (!card) throw new Error(`Flashcard not found for set with id: ${id}`);
            return card;
        }));

        let weakPoints = "";

        weakFlashCards.map((flashCard) => (
            weakPoints += `Q: ${flashCard.question}/A: ${flashCard.answer}`
        ))

        const oldExamSet = await FlashcardSet.findById(setId);

        if (!oldExamSet) throw new NotFoundError("old exam set");

        oldExamSet.completed = true;
        await oldExamSet.save({session})

        const materials: IMaterialDoc[] = await Material.find({setId});

        if (!materials) throw new NotFoundError("Materials for exam set")

        let content = "";

        materials.map((mat) => (
            content += mat.parsedText
        ));
        
        const [newExamSet] = await FlashcardSet.create([{
            courseId: oldExamSet.courseId,
            type: "Exam",
            examDate: oldExamSet.examDate,
        }], {session});

        const prompt = focusedFlashcardGenPrompt(content, weakPoints, oldExamSet.examDate);
        
        console.log("gpt reached")
        const { text: gptText } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt
        })

        console.log("gpt finished");
        const { terms, title, currentSetCompletionDate } = await gptTextToFlashCards({
            gptText,
            session,
            setId: newExamSet._id
        });

        newExamSet.title = title;
        newExamSet.terms = terms;
        newExamSet.currentSetCompletionDate = currentSetCompletionDate;
        await newExamSet.save({session})

        await session.commitTransaction();

        revalidatePath("/")

        return {success: true, data: newExamSet, status: 201}

    } catch (error) {
        await session.abortTransaction();
        return handlerError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

export async function getWeeksExamSets() {
    await dbconnect();

    try {
        const userSession = await auth();

        if (!userSession || !userSession.user || !userSession.user.id) throw new NotFoundError("userId");

        const userId = userSession.user.id;

        const courses: ICourseDoc[] = await Course.find({ userId });

        const { sunday, saturday } = getSunSat();

        const examSets = (
        await Promise.all(
            courses.map((course) =>
            FlashcardSet.find({
                courseId: course._id,
                currentSetCompletionDate: {
                $gte: sunday,
                $lte: saturday,
                },
            })
            )
        )
        )

        const flatSets: IFlashcardSetDoc[] = examSets.flat();

        return { success: true, data: flatSets, status: 200 };
        
    } catch (error) {

        return handlerError(error) as ErrorResponse;
    } 
}

export async function getTodayExamSets() {
  await dbconnect();

  try {
    const userSession = await auth();
    if (!userSession?.user?.id) throw new NotFoundError("userId");
    const userId = userSession.user.id;

    // 1) fetch all of this user's courses
    const courses: ICourseDoc[] = await Course.find({ userId });

    // 2) build "start of today" and "start of tomorrow"
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    // 3) for each course, only grab sets completed today
    const examSetsArrays = await Promise.all(
      courses.map(course =>
        FlashcardSet.find({
          courseId: course._id,
          currentSetCompletionDate: {
            $gte: startOfDay,
            $lt: startOfTomorrow,
          },
        })
      )
    );

    // 4) flatten and return
    const flatSets: IFlashcardSetDoc[] = examSetsArrays.flat();
    return { success: true, data: flatSets, status: 200 };
  } catch (error) {
    return handlerError(error) as ErrorResponse;
  }
}