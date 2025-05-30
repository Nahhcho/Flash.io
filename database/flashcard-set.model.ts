import { model, models, Schema, Types } from "mongoose";

interface IFlashcardSet {
    title: string;
    courseId: Types.ObjectId;
    type: "Exam" | "Regular" ;
    materials: Types.ObjectId[];
}

const FlashcardSetSchema = new Schema(
    {
        title: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        material: [{ type: Schema.Types.ObjectId, ref: "Material" , required: true }]
    }
)

const FlashcardSet = models?.FlashcardSet || model<IFlashcardSet>("FlashcardSet", FlashcardSetSchema)

export default FlashcardSet;