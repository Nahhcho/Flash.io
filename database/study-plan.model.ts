import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IStudyPlan {
    title: string;
    courseId: Types.ObjectId;
    startDate: Date;
    examDate: Date;
    completedQuizzes: number;
    totalRightCount: number;
    totalWrongCount: number;
    totalSeconds: number;
}

export type IStudyPlanDoc = HydratedDocument<IStudyPlan>;
const StudyPlanSchema = new Schema(
    {
        title: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        startDate: { type: Date, required: true },
        examDate: { type: Date },
        completedQuizzes: { type: Number, default: 0 },
        totalRightCount: { type: Number, default: 0 },
        totalWrongCount: { type: Number, default: 0 },
        totalSeconds: { type: Number, default: 0 }
    }
)

const StudyPlan = models?.StudyPlan || model<IStudyPlan>("StudyPlan", StudyPlanSchema);

export default StudyPlan;