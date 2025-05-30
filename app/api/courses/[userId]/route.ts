import Course from "@/database/course.model";
import dbconnect from "@/lib/mongoose";
import { CourseSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }>}) {
    const { userId } = await params;
    if (!userId) throw new Error("No user id");

    try {
        await dbconnect();
        
        const validatedData = CourseSchema.partial().safeParse({ userId });

        if (!validatedData.success) throw new Error(`${validatedData.error.flatten().fieldErrors}`);

        const courses = await Course.find(validatedData.data) 

        return NextResponse.json({ success: true, data: courses}, { status: 200})
    } catch (error) {
        throw error;
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }>}) {
    const { userId } = await params;

    if (!userId) throw new Error("broke");
    
    try {
        dbconnect();

        const body = await req.json()

        const validatedData = CourseSchema.safeParse({ userId, ...body });

        if (!validatedData.success) throw new Error(`${validatedData.error.flatten().fieldErrors}`);

        const course = Course.create(validatedData.data);

        return NextResponse.json({ success: true, data: course }, { status: 201 });
    } catch (error) {
        throw error;
    }
}