"use client";
import { z, ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import React from 'react'
import { DefaultValues, Path, PathValue, SubmitHandler, useForm } from "react-hook-form"
import Image from "next/image";
import { ALLOWED_FILES } from "@/constants/allowedFileTypes";
import { CreateCourse } from "@/lib/actions/course.action";
import { CreateSet } from "@/lib/actions/set.action";
import Loading from "@/app/(root)/courseDetails/[courseId]/loading";

type SharedValues = {
    title: string,
    materials: FileList
}

interface CreateFormProps<T> { 
    formType: "ADD_COURSE" | "ADD_SET" | "ADD_EXAM_SET";
    defaultValues?: T;
    schema: ZodType<T>;
    courseId?: string;
}

const CreateForm = <T extends SharedValues>({
    formType,
    defaultValues,
    courseId,
    schema
}: CreateFormProps<T>) => {
    const buttonText = formType === "ADD_COURSE" ? "Create Course" : "Add Set";
    const optional = formType === "ADD_COURSE" ? "(optional)" : "";
    const header = formType === "ADD_COURSE" ? "Course" : formType === "ADD_EXAM_SET" ? "Exam Set" : "Set";

    const form = useForm<z.infer<typeof schema>>(
        {
            resolver: zodResolver(schema),
            defaultValues: defaultValues as DefaultValues<T>
        }
    )
    const watchedMaterials = form.watch("materials" as Path<T>);

    const handleSubmit: SubmitHandler<T> = async (data: T) => {
        switch (formType) {
            case "ADD_COURSE":
                await CreateCourse(data);
                break;
            
            case "ADD_SET":
                await CreateSet(data, courseId as string)
                break;

            case "ADD_EXAM_SET":
                break;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files;
        const currentFiles = form.getValues("materials" as Path<T>);

        if (newFiles && newFiles.length > 0) {
            const validNewFiles = Array.from(newFiles).filter((file) => {
                const ext = file.name.split('.').pop()?.toLowerCase() as typeof ALLOWED_FILES[number];
                return ext && (ALLOWED_FILES as readonly string[]).includes(ext);
            })
            
            if (validNewFiles.length !== newFiles.length) {
                form.setError("materials" as Path<T>, { message: "Only PDF, DOCX, PPTX, TXT, or CSV files are allowed." })
            } else (form.trigger("materials" as Path<T>))

            const mergedFiles = [...(currentFiles ? Array.from(currentFiles as FileList): []), ...Array.from(validNewFiles)];

                const dataTransfer = new DataTransfer();
            mergedFiles.forEach((file) => dataTransfer.items.add(file as File));

            const combinedFileList = dataTransfer.files

            form.setValue("materials" as Path<T>, combinedFileList as PathValue<T, Path<T>>);
        }
    }

    const handleFileRemove = (file: File) => {
        const currentFiles = form.getValues("materials" as Path<T>) as FileList;

        if (!currentFiles) return null;

        const arrWithRemovedFile = Array.from(currentFiles).filter((curFile) => curFile !== file);
        const dataTransfer = new DataTransfer();

        arrWithRemovedFile.forEach((file) => dataTransfer.items.add(file))

        form.setValue("materials" as Path<T>, dataTransfer.files as PathValue<T, Path<T>>)
    }

  return ( 
    <>

            <form onSubmit={form.handleSubmit(handleSubmit)} >

                <p className='font-sora text-white text-[28px] pb-[10px]'>{header} Name</p>

                <input {...form.register("title" as Path<T>)} className='mb-[5px] h-[54px] bg-[#3D516D] rounded-[10px] w-full text-white font-sora px-[16px] focus:outline-none' placeholder='title'/>
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
                {
                watchedMaterials instanceof FileList && Array.from(watchedMaterials).map((file) => (
                    <li key={file.name} onClick={() => handleFileRemove(file)} className="font-sora text-white text-[18px] cursor-pointer">
                        • {file.name}
                    </li>
                    ))
                }
                </ul>
                
                {form.formState.errors.materials && <p className="text-red-500 font-sora text-[18px]">{form.formState.errors.materials.message as string}</p>}

                <button type="submit" disabled={form.formState.isSubmitting ? true : false} className='flex justify-center cursor-pointer text-white font-sora  mt-[30px] font-semibold text-[24px] rounded-[10px] bg-[#6366F1] hover:bg-[#898BF4] w-[48%] py-[19px] '>
                    {form.formState.isSubmitting ? "Submitting..." : buttonText }
                </button>
            </form>
    </>
  )
}

export default CreateForm