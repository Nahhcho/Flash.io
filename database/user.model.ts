import { model, models, Schema } from "mongoose";

interface IUser {
    name: string;
    email: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String }
}, { timestamps: true });

const User = models?.User || model<IUser>("User", UserSchema);

export default User;