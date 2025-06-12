import { HydratedDocument, model, models, Schema, Types } from "mongoose";

interface IMaterial {
    name: string;
    url?: string;
    size?: number;
    setId: Types.ObjectId;
    courseId: Types.ObjectId;
    parsedText: string;
    createdAt?: Date;
}

export type IMaterialDoc = HydratedDocument<IMaterial>;
const MaterialSchema = new Schema<IMaterial>(
    {
        name: { type: String, required: true },
        size: { type: String },
        url: { type: String },
        courseId: { type: Schema.Types.ObjectId, ref: "Courses" , required: true},
        setId: { type: Schema.Types.ObjectId, ref: "FlashcardSet", required: true},
        parsedText: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

const Material = models?.Material || model<IMaterial>("Material", MaterialSchema);

export default Material;