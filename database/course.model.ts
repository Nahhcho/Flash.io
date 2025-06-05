import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface ICourse {
    title: string;
    userId: Types.ObjectId;
}

export type ICourseDoc = HydratedDocument<ICourse>;
const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User" , required: true }
    } 
)

const Course = models?.Course || model<ICourse>("Course", CourseSchema);

export default Course;