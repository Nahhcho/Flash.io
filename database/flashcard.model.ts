import { model, models, Schema, Types } from "mongoose";

interface IFlashcard {
    question: string;
    answer: string;
    setId: Types.ObjectId;
}

const FlashcardSchema = new Schema(
    {
        question: { type: String, required: true},
        answer: { type: String, required: true },
        setId: { type: String, ref: "FlashcardSet", required: true },
    }
);

const Flashcard = models?.Flashcard || model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;