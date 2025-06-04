import { model, models, Schema, Types } from "mongoose";

export interface IAccount {
    name: string;
    email: string;
    provider: string;
    providerAccountId: string;
    userId: Types.ObjectId;
    image?: string;
    createdAt?: string;
}

export interface IAccountDoc extends IAccount, Document {}
const AccountSchema = new Schema<IAccount>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    provider: { type: String },
    providerAccountId: { type: String},
    userId: { type: Schema.Types.ObjectId }
}, { timestamps: true })

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;