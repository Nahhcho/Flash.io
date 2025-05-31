import { model, models, Schema, Types } from "mongoose";

interface IAccount {
    name: string;
    email: string;
    provider: string;
    providerAccountId: string;
    username?: string;
    userId: Types.ObjectId;
    image?: string;
    createdAt?: string;
}

const AccountSchema = new Schema<IAccount>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String },
    image: { type: String }
}, { timestamps: true })

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;