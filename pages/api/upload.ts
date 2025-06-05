import dbconnect from "@/lib/mongoose";
import { CourseSchema, MaterialSchemaBeforeCreate } from "@/lib/validations";
import formidable, { Fields, Files } from "formidable";
import { IncomingForm } from "formidable"; 
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import path from "path";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { auth } from "@/auth";
import Course from "@/database/course.model";
import fs from "fs/promises";

import pdfParse from "pdf-parse";
import mammoth from "mammoth";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import PdfParse from "pdf-parse";
import { buffer } from "stream/consumers";
import Material from "@/database/material.model";
import handlerError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";
import { parseForm } from "@/lib/parsers/parse-form";

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function CourseWithFilesPOST(req: NextApiRequest, res: NextApiResponse) {
    
    await dbconnect();
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fields, files } = await parseForm(req as any);

        if (!(fields?.title)) throw new NotFoundError("title");
        
        if (!(fields?.userId)) throw new NotFoundError("userId");
        
        const title = fields.title[0];
        const userId = fields.userId[0];
    
        const validatedCourseData = CourseSchema.safeParse({ title, userId });

        if (!validatedCourseData.success) throw new ValidationError(validatedCourseData.error.flatten().fieldErrors);

        const [course] = await Course.create([{ title, userId }], { session });
        
        console.log("FILES: ", files)
        if(files && Object.keys(files).length > 0) {
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
                        parsedText,
                        size: file.size,
                    })
                })
            ) 
            
            const materialList = await Promise.all(fileList.map(async (file) => {
                const validatedFile = MaterialSchemaBeforeCreate.safeParse(file);
                if (!validatedFile.success) throw new ValidationError(validatedFile.error.flatten().fieldErrors);
    
                const data = validatedFile.data
                const material = await Material.create([{...data, courseId: course.id}], {session});
                return material
            }))

        }
        
        // session.commitTransaction();

        return res.status(201).json({ data: course, success: true });
        
    } catch (error) {
        await session.abortTransaction();
        console.log(error)
        return res.status(500).json({ "There was an error: ": error })
    }


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