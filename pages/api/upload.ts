import Course from "@/database/course.model";
import dbconnect from "@/lib/mongoose";
import { AddCourseMetaSchema } from "@/lib/validations";
import formidable, { Fields, Files } from "formidable";
import { IncomingForm } from "formidable"; 
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function CourseWithFilesPOST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    await dbconnect();

    const form = new IncomingForm({
        uploadDir: path.join(process.cwd(), "public", "uploads"),
        keepExtensions: true,
        multiples: true
    })

    const { fields, files }: { fields: Fields, files: Files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files }) 
        })
    })

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;

    const uploadedFiles = Array.isArray(files.materials) ? files.materials : [files.materials];

    // Add this line to remove undefined entries:
    const validFiles = uploadedFiles.filter((f): f is formidable.File => !!f);

    const materialsMeta = validFiles.map((file) => ({
    name: file.originalFilename,
    type: file.mimetype,
    size: file.size,
    path: '/uploads/' + path.basename(file.filepath),
    }));
    
    
    const validatedData = AddCourseMetaSchema.safeParse({ title, materials: materialsMeta }); 

    
    if (!validatedData.success) {
        console.log(validatedData.error.flatten());
        return res.status(400).json({ error: "Invalid data", details: validatedData.error.flatten() });
    }

    const newCourse = await Course.create(validatedData.data)

    return res.status(201).json({ success: true, data: newCourse})
    
}