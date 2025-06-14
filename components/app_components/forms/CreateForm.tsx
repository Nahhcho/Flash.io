"use client";
import { z, ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Path, PathValue, SubmitHandler, useForm } from "react-hook-form"
import Image from "next/image";
import { ALLOWED_FILES } from "@/constants/allowedFileTypes";
import { CreateCourse } from "@/lib/actions/course.action";
import { CreateSet } from "@/lib/actions/set.action";
import { Input } from "@/components/ui/input";
import FileUpload from "../loaders/FileUpload";
import ErrorUpload from "../loaders/ErrorUpload";
import { CreateStudyPlan } from "@/lib/actions/studyPlan.action";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CreateFormProps<TSchema extends ZodType<any, any, any>> {
  formType: "ADD_COURSE" | "ADD_SET" | "ADD_EXAM_SET";
  schema: TSchema;
  defaultValues: z.infer<TSchema>;
  courseId?: string;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CreateForm = <TSchema extends ZodType<any, any, any>>({
    setIsOpen,
    isSubmitting,
    setIsSubmitting,
    formType,
    defaultValues,
    schema,
    courseId
}: CreateFormProps<TSchema>) => {
    const buttonText = formType === "ADD_COURSE" ? "Add Course" : formType === "ADD_SET" ? "Add set" : "Add exam";
    const optional = formType === "ADD_COURSE" ? "(optional)" : "";
    const header = formType === "ADD_COURSE" ? "Course" : formType === "ADD_EXAM_SET" ? "Exam " : "Set";
    const form = useForm<z.infer<TSchema>>(
        {
            resolver: zodResolver(schema),
            defaultValues
        }
    )
    const watchedMaterials = form.watch("materials" as Path<TSchema>);
    const [error, setError] = useState(false);

    const handleSubmit: SubmitHandler<z.infer<TSchema>> = async (data) => {
        setIsSubmitting(true);
        let res;
        switch (formType) {
            case "ADD_COURSE":
                res = await CreateCourse(data);
                break;
                
                case "ADD_SET":
                res = await CreateSet(data, courseId as string)
                console.log("GPT says this log should show up now")
                if (res.success) {
                    setIsOpen(false);
                }
                break;

            case "ADD_EXAM_SET":
                res = await CreateStudyPlan({...data, courseId });
                break;
        }

        if (!res.success) {
            setIsSubmitting(false)
            setError(true)
        }
    };

    function isFileList(value: unknown): value is FileList {
        return typeof FileList !== "undefined" && value instanceof FileList;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files;
        const currentFiles = form.getValues("materials" as Path<TSchema>);

        if (newFiles && newFiles.length > 0) {
            const validNewFiles = Array.from(newFiles).filter((file) => {
                const ext = file.name.split('.').pop()?.toLowerCase() as typeof ALLOWED_FILES[number];
                return ext && (ALLOWED_FILES as readonly string[]).includes(ext);
            })
            
            if (validNewFiles.length !== newFiles.length) {
                form.setError("materials" as Path<TSchema>, { message: "Only PDF, DOCX, PPTX, TXT, or CSV files are allowed." })
            } else (form.trigger("materials" as Path<TSchema>))

            const mergedFiles = [...(currentFiles ? Array.from(currentFiles as FileList): []), ...Array.from(validNewFiles)];

                const dataTransfer = new DataTransfer();
            mergedFiles.forEach((file) => dataTransfer.items.add(file as File));

            const combinedFileList = dataTransfer.files

            form.setValue("materials" as Path<TSchema>, combinedFileList as PathValue<TSchema, Path<TSchema>>);
        }
    }

    const handleFileRemove = (file: File) => {
        const currentFiles = form.getValues("materials" as Path<TSchema>) as FileList;

        if (!currentFiles) return null;

        const arrWithRemovedFile = Array.from(currentFiles).filter((curFile) => curFile !== file);
        const dataTransfer = new DataTransfer();

        arrWithRemovedFile.forEach((file) => dataTransfer.items.add(file))

        form.setValue("materials" as Path<TSchema>, dataTransfer.files as PathValue<TSchema, Path<TSchema>>)
    }  

    if (isSubmitting) {
        return <FileUpload message={"Generating intelligent flashcards..."}/>
    }

    if (error) {
        return <ErrorUpload setIsOpen={setIsOpen} />
    }

  return ( 
    <>

            <form onSubmit={form.handleSubmit(handleSubmit)} >

                <p className='font-sora text-white text-[28px] pb-[10px]'>{header} Name</p>

                <input {...form.register("title" as Path<TSchema>)} className='mb-[5px] h-[54px] bg-[#3D516D] rounded-[10px] w-full text-white font-sora px-[16px] focus:outline-none' placeholder='title'/>
                {form.formState.errors.title && <p className="text-red-500 font-sora text-[18px]">{form.formState.errors.title.message as string}</p>}
                
                <p className='py-[10px] font-sora text-white text-[28px]'>{header} Materials {optional}</p>

                <label className='bg-[#3D516D] flex justify-center items-center py-[28px] rounded-[10px] cursor-pointer'>
                    <input type="file" multiple hidden onChange={handleFileChange} />
                    <div className='flex gap-[25px]'>
                    <Image src={'/file.png'} width={36} height={47} alt='file' />
                    <p className='text-white font-sora text-[28px]'>Drop all files</p>
                    </div>
                </label>
                
                <ul className="pt-4 flex flex-wrap gap-3">
                    {isFileList(watchedMaterials) &&
                        Array.from(watchedMaterials as FileList).map((file) => (
                            <li
                            key={file.name}
                            onClick={() => handleFileRemove(file)}
                            className="font-sora text-white text-[18px] cursor-pointer"
                            >
                            • {file.name}
                            </li>
                        ))
                        }
                </ul>
                
                {form.formState.errors.materials && <p className="text-red-500 font-sora text-[18px]">{form.formState.errors.materials.message as string === "You must upload at least 1 and at most 5 valid files (PDF, DOCX, PPTX, TXT, or CSV)." ? (watchedMaterials.length === 0 ? form.formState.errors.materials.message as string : null) : form.formState.errors.materials.message as string}</p>}

                { formType === "ADD_EXAM_SET" && 
                <div>
                    <label htmlFor="exam-date" className="text-white font-sora text-[28px]">
                        Date Of Exam
                    </label>
                    <Input
                        id="exam-date"
                        type="date"
                        {...form.register("examDate" as Path<TSchema>)}
                        className="bg-[#3d516d] border-none mt-[10px] text-[#ffffff] text-[20px] h-14 rounded-lg [color-scheme:dark] date-input"
                    />
                    {form.formState.errors.examDate && <p className="text-red-500 font-sora text-[18px]">{form.formState.errors.examDate.message as string}</p>}
                </div>
                }

                <button type="submit" disabled={form.formState.isSubmitting ? true : false} className='flex justify-center cursor-pointer text-white font-sora  mt-[30px] font-semibold text-[24px] rounded-[10px] bg-[#6366F1] hover:bg-[#898BF4] w-[48%] py-[19px] '>
                    {form.formState.isSubmitting ? "Submitting..." : buttonText }
                </button>
            </form>
    </>
  )
}

export default CreateForm