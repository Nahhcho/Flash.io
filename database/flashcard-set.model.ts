import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IFlashcardSet {
    title?: string;
    courseId: Types.ObjectId;
    type: "Exam" | "Regular" ;
    terms?: number;
}

export type IFlashcardSetDoc = HydratedDocument<IFlashcardSet>;
const FlashcardSetSchema = new Schema(
    {
        title: { type: String },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        type: { 
            type: String,
            enum: ["Exam", "Regular"],
            required: true
        },
        terms: { type: Number }
    }
)

const FlashcardSet = models?.FlashcardSet || model<IFlashcardSet>("FlashcardSet", FlashcardSetSchema)

export default FlashcardSet;