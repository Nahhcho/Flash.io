import Account from "@/database/account.model";
import handlerError from "@/lib/handlers/error"
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { providerAccountId } = await req.json()

    try {
        await dbconnect();

        const validatedData = AccountSchema.partial().safeParse({providerAccountId});

        if (!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        }

        const existingAccount = await Account.findOne({ providerAccountId })

        if (!existingAccount) {
            throw new NotFoundError("Account");
        }

        return NextResponse.json({success: true, data: existingAccount}, {status: 200})

    } catch (error) {
        return handlerError(error, "api") as APIErrorResponse;
    }
}