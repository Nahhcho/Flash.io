import { model, models, Schema, Types } from "mongoose";

interface ICourse {
    title: string;
    userId: Types.ObjectId;
}

const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User" , required: true }
    } 
)

const Course = models?.Course || model<ICourse>("Course", CourseSchema);

export default Course;