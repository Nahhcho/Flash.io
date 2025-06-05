"use server";

import { ActionResponse } from "@/types/global";
import { api } from "../api";
import { ICourseDoc } from "@/database/course.model";
import { redirect } from "next/navigation";

export async function CreateCourse(formData: FormData, userId: string) {
    const response = (await api.courses.create(formData, userId)) as ActionResponse<ICourseDoc>;

    if (!response.success || !response.data) return response;
    
    const courseId = response.data._id;
    
    console.log("redirect now: ", response.success)
    redirect(`/courseDetails/${courseId}`);
}