import Account from "@/database/account.model";
import User from "@/database/user.model";
import handlerError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { SignInWithoAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log("API HIT")
    const { user: userInfo, provider, providerAccountId } = await request.json();
    await dbconnect();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        
        const validatedData = SignInWithoAuthSchema.safeParse({userInfo, provider, providerAccountId});

        if (!validatedData.success) {
            console.log("ZOD ERROR")
            console.log(userInfo, providerAccountId, provider)
            console.log(validatedData.error.flatten().fieldErrors) 
            throw new ValidationError(validatedData.error.flatten().fieldErrors)
        };

        const { name, email, image } = userInfo;
        let existingUser = await User.findOne({ email }).session(session);

        if (!existingUser) {
            [existingUser] = await User.create([{email, name, image}], {session})
        }

        let existingAccount = await Account.findOne({
            userId: existingUser._id,
            provider,
            providerAccountId
        }).session(session);
        
        if (!existingAccount) {
           [existingAccount] = await Account.create([{ userId: existingUser._id, provider, providerAccountId, name, email, image}], { session }); 
        }

        await session.commitTransaction();

        return NextResponse.json({ success: true });
    } catch (error) {
        await session.abortTransaction();

        console.log("api error")
        console.log(handlerError(error, "api") as APIErrorResponse)
        return handlerError(error, "api") as APIErrorResponse;
    }
}