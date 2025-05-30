import User from "@/database/user.model";
import dbconnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbconnect();

        const body = await request.json();

        const validatedData = UserSchema.safeParse(body);

        if (!validatedData.success) {
            throw new Error(`${validatedData.error.flatten().fieldErrors}`);
        }

        const { email } = validatedData.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) throw new Error("User already exists");

        const newUser = await User.create(validatedData.data);

        return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    } catch (error) {
        throw error
    }
}