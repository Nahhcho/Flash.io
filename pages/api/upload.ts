import dbconnect from "@/lib/mongoose";
import { CourseSchema, MaterialSchemaBeforeParsing } from "@/lib/validations";
import formidable, { Fields, Files } from "formidable";
import { IncomingForm } from "formidable"; 
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import path from "path";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { auth } from "@/auth";
import Course from "@/database/course.model";
import fs from "fs/promises";

import pdfParse from "pdf-parse";
import mammoth from "mammoth";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import PdfParse from "pdf-parse";
import { buffer } from "stream/consumers";

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function CourseWithFilesPOST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const form = new IncomingForm({
            keepExtensions: true,
            multiples: true
        })
    
        const { fields, files }: { fields: Fields, files: Files} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files }) 
            })
        })
    
        const uploadedFiles = Array.isArray(files.materials) ? files.materials : [files.materials];

        const fileList = await Promise.all(
            uploadedFiles.map(async (file) => {
                if (!file) throw new Error("Error handling file")
        
                const ext = path.extname(file.originalFilename!).toLowerCase();
                const buffer = await fs.readFile(file.filepath)
                let parsedText = "";
        
                switch (ext) {
                    case ".txt":
                        parsedText = buffer.toString();
                        break;
        
                    case ".pdf":
                        parsedText = (await pdfParse(buffer)).text;
                        break;
                    
                    case ".docx":
                        parsedText = (await mammoth.extractRawText({ buffer })).value;
                        break;
                    
                    case ".cvs":
                        parsedText = buffer.toString();
                        break;
                }
        
        
                return ({
                    name: file.originalFilename,
                    parsedText
                })
            })
        ) 
            

        const title = fields!.title![0]
    
        console.log("title", title);
        console.log("files", fileList);
        console.log("API HIT")
    } catch (error) {
        console.log(error)
    }

    let extractedTextForGpt = "";

    // const materialsMeta = await Promise.all(
    // validFiles.map(async (file) => {
    //     const filePath = file.filepath;
    //     let extractedText = "";
    //     const buffer = await fs.readFile(filePath);

    //     if (file.originalFilename?.endsWith(".pdf")) {
    //     const pdfData = await pdfParse(buffer);
    //     extractedText = pdfData.text;
    //     } else if (file.originalFilename?.endsWith(".docx")) {
    //     const result = await mammoth.extractRawText({ buffer });
    //     extractedText = result.value;
    //     } else if (file.originalFilename?.endsWith(".txt")) {
    //     extractedText = buffer.toString("utf-8");
    //     } else {
    //     extractedText = "[Unsupported file type]";
    //     }

    //     if (!extractedText || extractedText === "[Unsupported file type]") {
    //     return { file: file.originalFilename, summary: "Could not extract text." };
    //     }

    //     extractedTextForGpt += extractedText;

    //     return {
    //     name: file.originalFilename,
    //     size: file.size,
    //     parsedText: extractedText,
    //     path: "/uploads/" + path.basename(file.filepath),
    //     };
    // })
    // );

    // console.log("END");
    // console.log(extractedTextForGpt);
    
    // const { text } = await generateText({
    //     model: openai("gpt-4o-mini"),
    //     prompt: `Create flashcards from this content in the form:\nQ: <question>\nA: <answer>\n\nContent:\n${extractedTextForGpt}`
    // })

    // console.log(text)


    // await dbconnect();
    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //     const userSession = await auth();

    //     if (!userSession) throw new UnauthorizedError("User id isn't authorized");
    //     const userId = userSession.user!.id;

    //     const validatedCourseData = CourseSchema.safeParse({title, userId});

    //     if (!validatedCourseData.success) throw new ValidationError(validatedCourseData.error.flatten().fieldErrors);
        
    //     const [newCourse] = Course.create([{title, userId}], {session});

    //     materialsMeta.map((file) => {
    //         const validatedFile = MaterialSchemaBeforeParsing.safeParse(file)

    //         if (!validatedFile.success) throw new ValidationError(validatedFile.error.flatten().fieldErrors);

            

    //     })
    
    //     // return res.status(201).json({ success: true, data: newCourse})
    // } catch (error) {
    //     session.abortTransaction();
    //     return res.status(400).json({ success: false, error })
    // }
    
    
}