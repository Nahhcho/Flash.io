import User from "@/database/user.model";
import dbconnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET(_:Request, { params }: { params: Promise<{ email: string}>}) {
    const { email } = await params;
    if (!email) throw new Error("User not found!")

    try {
        await dbconnect();

        const validatedData = UserSchema.partial().safeParse({ email })
        
        if (!validatedData.success) {
            throw new Error(`${validatedData.error.flatten().fieldErrors}`)
        }

        const user = User.findOne({ email });

        if (!user) throw new Error("User with that email doesn't exist");

        return NextResponse.json({ success: true, data: user}, { status: 200 })
    } catch (error) {
        throw error;
    }
    
}