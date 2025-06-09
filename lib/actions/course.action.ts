"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import { api } from "../api";
import { ICourseDoc } from "@/database/course.model";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROUTES } from "@/constants/routes";

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