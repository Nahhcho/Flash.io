"use server";

import { ErrorResponse } from "@/types/global";
import { api } from "../api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import dbconnect from "../mongoose";
import mongoose from "mongoose";
import handlerError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import FlashcardSet from "@/database/flashcard-set.model";
import Flashcard, { IFlashcardDoc } from "@/database/flashcard.model";
import Material, { IMaterialDoc } from "@/database/material.model";
import { focusedFlashcardGenPrompt } from "@/constants/flashcardGenPrompt";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { gptTextToFlashCards } from "../parsers/parse-gpt-text";
import StudyPlan from "@/database/study-plan.model";
import { toLocalMidnight } from "../utils/dateLogic";

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
    
    return { success: true, data: response, status: 201 }
}

export async function DeleteSet(setId: string) {
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();
    let courseId: string;
    try {
        const set = await FlashcardSet.findByIdAndDelete(setId, { session });
        await Flashcard.deleteMany({ setId }, { session });
        
        courseId = set.courseId

        await session.commitTransaction();  

    } catch (error) {
        await session.abortTransaction();
        
        return handlerError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
    redirect(`/courseDetails/${courseId}`)
}

export async function iterateExamSet(setId: string, weakIds: string[], rightCount: number, wrongCount: number, percentage: number, totalSeconds: number) {
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

        console.log("attempting study plan search")
        const oldExamSet = await FlashcardSet.findById(setId);
        console.log("studyplan found")
        const studyPlan = await StudyPlan.findById(oldExamSet.studyPlanId);

        studyPlan.completedQuizzes += 1;
        studyPlan.totalRightCount += rightCount;
        studyPlan.totalWrongCount += wrongCount;
        studyPlan.totalSeconds += totalSeconds;
        await studyPlan.save({session});

        if (!oldExamSet) throw new NotFoundError("old exam set");

        oldExamSet.completed = true;
        oldExamSet.totalSeconds = totalSeconds;
        oldExamSet.rightCount = rightCount;
        oldExamSet.wrongCount = wrongCount;
        oldExamSet.percentage = percentage;
        await oldExamSet.save({session})

        const materials: IMaterialDoc[] = await Material.find({setId});

        if (!materials) throw new NotFoundError("Materials for exam set")

        let content = "";

        materials.map((mat) => (
            content += mat.parsedText
        ));
        
        const title = studyPlan.title + ` Review ${studyPlan.completedQuizzes + 1}`;

        console.log("attempting set creation with study plan id: ", studyPlan._id);
        console.log(title)
        const [newExamSet] = await FlashcardSet.create([{
            title,
            courseId: oldExamSet.courseId,
            type: "Exam",
            studyPlanId: studyPlan._id,
        }], {session});
        console.log("new set created: ", newExamSet)

        const prompt = focusedFlashcardGenPrompt(content, weakPoints, studyPlan.examDate);

        console.log("gpt reached")
        const { text: gptText } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt
        })

        console.log("gpt finished");
        const { terms, suggestedTitle, currentSetCompletionDate } = await gptTextToFlashCards({
            gptText,
            session,
            setId: newExamSet._id
        });

        newExamSet.terms = terms;
        newExamSet.dueDate = toLocalMidnight(currentSetCompletionDate!);
        await newExamSet.save({session})

        await session.commitTransaction();

        console.log("iteration complete! NewExamSet: ", newExamSet);
        console.log("Updated old completed exam set: ", oldExamSet);

        revalidatePath("/")

        return {success: true, data: newExamSet, status: 201}

    } catch (error) {
        await session.abortTransaction();
        return handlerError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

