import { ALLOWED_FILES, AllowedFileTypes } from "@/constants/allowedFileTypes";
import { model, models, Schema, Types } from "mongoose";

interface IMaterial {
    materialName: string;
    fileType?: AllowedFileTypes;
    url?: string;
    courseId: Types.ObjectId;
    parsedText: string;
    createdAt?: Date;
    setIds?: Types.ObjectId[];
    examSetIds?: Types.ObjectId[];
}

const MaterialSchema = new Schema<IMaterial>(
    {
        materialName: { type: String, required: true },
        fileType: { type: String, enum: ALLOWED_FILES },
        url: { type: String },
        courseId: { type: Schema.Types.ObjectId, ref: "Coures" , required: true},
        setIds: [{ type: Schema.Types.ObjectId, ref: "FlashcardSet"}],
        examSetIds: [{ type: Schema.Types.ObjectId, ref: "ExamSet"}],
        parsedText: { type: String },
    },
    {
        timestamps: true
    }
)

const Material = models?.Material || model<IMaterial>("Material", MaterialSchema);

export default Material;