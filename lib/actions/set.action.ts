"use server";

import { ErrorResponse } from "@/types/global";
import { api } from "../api";
import { redirect } from "next/navigation";

export async function CreateSet<T extends {title: string, materials: FileList}>(data: T, courseId: string) {
    const formData = new FormData();
    const { title, materials } = data;

    formData.append("title", title);
    
    Array.from(materials).forEach((file) => {
        formData.append("materials", file);
    });
     
    const response = (await api.FlashcardSets.createSet(formData, courseId));

    if (!response.success || response.data) {
        console.log(response)
        return response as ErrorResponse;
    }

    redirect(`/courseDetails/${courseId}`);
}