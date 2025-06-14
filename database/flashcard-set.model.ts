import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IFlashcardSet {
    title?: string;
    courseId: Types.ObjectId;
    studyPlanId?: Types.ObjectId;
    type: "Exam" | "Regular" ;
    terms?: number;
    dueDate?: Date;
    completed?: boolean;
    percentage?: number;
    rightCount?: number;
    wrongCount?: number;
    totalSeconds?: number; 
}

export type IFlashcardSetDoc = HydratedDocument<IFlashcardSet>;
const FlashcardSetSchema = new Schema(
    {
        title: { type: String },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        studyPlanId: { type: Schema.Types.ObjectId, ref: "StudyPlan" },
        type: { 
            type: String,
            enum: ["Exam", "Regular"],
            required: true
        },
        terms: { type: Number },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
        percentage: { type: Number },
        rightCount: { type: Number },
        wrongCount: { type: Number },
        totalSeconds: { type: Number }
    }
)

const FlashcardSet = models?.FlashcardSet || model<IFlashcardSet>("FlashcardSet", FlashcardSetSchema)

export default FlashcardSet;