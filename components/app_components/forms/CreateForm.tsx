"use client";
 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from 'react'
import { DefaultValues, FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { AddCourseSchema } from "@/lib/validations";
import Image from "next/image";


interface CreateFormProps<T extends FieldValues> { //T extend FieldValues means to only allow T if it's a valid form data object (like an object of strings, numbers, etc
    formType: "ADD_COURSE" | "ADD_SET";
    defaultValues: T;
}

const CreateForm = <T extends FieldValues>({ formType,  defaultValues}: CreateFormProps<T>) => {
    const buttonText = formType === "ADD_COURSE" ? "Add Course" : "Add Set";
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof AddCourseSchema>>(
        {
            resolver: zodResolver(AddCourseSchema),
            defaultValues: defaultValues as DefaultValues<T> //So... what is DefaultValues<T>? It’s a utility type from React Hook Form that ensures: The shape of your defaultValues matches the fields in the form.
        }
    )

    const materials = form.watch("materials");

    useEffect(() => {

        console.log(form.getValues())

    }, [materials]);
    

    const handleSubmit: SubmitHandler<z.infer<typeof AddCourseSchema>> = async () => {
        console.log(form.getValues())
        await new Promise((resolve) => setTimeout(resolve, 1000))
    };

    

  return ( 
    <>
        {
            isOpen && 
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen' onClick={() => {setIsOpen(false); form.reset()}}>
            <form onSubmit={form.handleSubmit(handleSubmit)} onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px]'>
                <p className='font-sora text-white text-[28px] pb-[10px]'>Course Name</p>
                <input {...form.register("title")} className='mb-[20px] h-[54px] bg-[#3D516D] rounded-[10px] w-full text-white font-sora px-[16px] focus:outline-none' placeholder='title'/>
                <p className='pb-[10px] font-sora text-white text-[28px]'>Course Materials (optional)</p>
                <label className="cursor-pointer">
                <input 
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => {
                        const newFiles = e.target.files;
                        const currentFiles = form.getValues("materials");

                        if (newFiles && newFiles.length > 0) {
                            const validNewFiles = Array.from(newFiles).filter((file) => file.type === "application/pdf")
                            
                            if (validNewFiles.length !== newFiles.length) {
                                form.setError("materials", { message: "Files must be pdfs" })
                            } else (form.trigger("materials"))

                            const mergedFiles = [...(currentFiles ? Array.from(currentFiles): []), ...Array.from(validNewFiles)];

                            //FileList is immutable so it can't be construct directly. So use DataTransfer to build the list
                            const dataTransfer = new DataTransfer();
                            mergedFiles.forEach((file) => dataTransfer.items.add(file));

                            const combinedFileList = dataTransfer.files

                            form.setValue("materials", combinedFileList);

                        }
                    }}
                />
                <div className='bg-[#3D516D] flex justify-center items-center py-[28px] rounded-[10px]'>
                    <div className='flex gap-[25px]'>
                    <Image src={'/file.png'} width={36} height={47} alt='file' />
                    <p className='text-white font-sora text-[28px]'>Drop all files</p>
                    </div>
                </div>
                </label>
                <ul className="pt-4 flex flex-wrap gap-3">
                    {
                        Array.from(form.watch("materials") || []).map((file, i) => (
                            <li key={i} className="font-sora text-white text-[18px] cursor-pointer" onClick={() => {
                                const currentFiles = form.getValues("materials");

                                const arrWithRemovedFile = Array.from(currentFiles).filter((curFile) => curFile !== file);
                                
                                const dataTransfer = new DataTransfer();

                                arrWithRemovedFile.forEach((file) => dataTransfer.items.add(file))

                                form.setValue("materials", dataTransfer.files)
                            }}>
                                • {file.name}
                            </li>
                        ))
                    }
                </ul>
                
                {form.formState.errors.materials && <p className="text-red-500 font-sora text-[18px]">{form.formState.errors.materials.message}</p>}

                <button type="submit" disabled={form.formState.isSubmitting} className='flex justify-center cursor-pointer text-white font-sora  mt-[30px] font-semibold text-[24px] rounded-[10px] bg-[#6366F1] hover:bg-[#898BF4] w-[48%] py-[19px] '>
                    {buttonText}
                </button>
            </form>
            </div>
        }
        <button onClick={() => setIsOpen(true)} className='col-start-4 col-end-7 flex w-[97%] justify-center mt-[40px] bg-[#6366F1] hover:bg-[#898BF4] py-[17px] rounded-[10px]'><span className='text-white text-[24px] font-sora font-semibold'>Add Course</span></button>
    </>
  )
}

export default CreateForm