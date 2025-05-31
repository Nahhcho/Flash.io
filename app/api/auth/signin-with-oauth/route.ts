import Account from "@/database/account.model";
import User from "@/database/user.model";
import dbconnect from "@/lib/mongoose";
import { SignInWithoAuthSchema } from "@/lib/validations";
import mongoose from "mongoose";

export async function POST(request: Request) {
    const { provider, providerAccountId, user } = await request.json();

    await dbconnect();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const validatedData = SignInWithoAuthSchema.safeParse({provider, providerAccountId, user});
        
        if (!validatedData.success) throw new Error("Invalid data");

        const { name, email, image } = user;

        let existingUser = await User.findOne({ email }).session(session);

        if (!existingUser) {
            [existingUser] = await User.create(
                [{ name, email, image }],
                { session }
            )
        } else {
            const updatedData: { name?: string; image?: string} = {};

            if (existingUser.name !== name) updatedData.name = name;
            if (existingUser.image !== image) updatedData.image = image;

            if (Object.keys(updatedData).length > 0) {
                await User.updateOne(
                    {_id: existingUser._id},
                    { $set: updatedData}
                ).session(session);
            }
        }

        const existingAccount = await Account.findOne({ 
            userId: existingUser._id,
            provider,
            providerAccountId,
        }).session(session);

        if (!existingAccount) {
            await Account.create([
                { userId: existingUser._id, name, image, provider, providerAccountId},
                { session }
            ])
        }

        await session.commitTransaction();
    } catch (error) {
        session.abortTransaction();
        throw error;
    }
}