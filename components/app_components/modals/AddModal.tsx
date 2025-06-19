"use client";

import React, { useEffect, useState } from 'react';
import CreateForm from '../forms/CreateForm';
import { CreateCourseHookForm, CreateExamSetHookForm, CreateSetHookForm } from '@/lib/validations';
import { ZodType } from 'zod';

interface ModalProps {
  formType: "ADD_COURSE" | "ADD_SET" | "ADD_EXAM_SET";
  courseId?: string;
}

const AddModal = ({ formType, courseId = "" }: ModalProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [buttonText, setButtonText] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [schema, setSchema] = useState<ZodType<any, any, any> | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [defaultValues, setDefaultValues] = useState<any | null>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      switch (formType) {
        case "ADD_COURSE":
          setButtonText("Add Course");
          setSchema(CreateCourseHookForm);
          setDefaultValues({
              title: "",
              materials: new DataTransfer().files, 
          })
          break;

        case "ADD_SET":
          setButtonText("Add set");
          setSchema(CreateSetHookForm)
          setDefaultValues({
              title: "",
              materials: new DataTransfer().files, 
          })
          break;
        
        case "ADD_EXAM_SET":
          setButtonText("Add an Exam");
          setSchema(CreateExamSetHookForm);
          setDefaultValues({
              title: "",
              materials: new DataTransfer().files,      
          })
          break

      }
    }, [])

  return (
    <>
    { isOpen &&
      <div className='fixed inset-0 bg-black/50 flex text-left items-center justify-center z-50 w-screen'  onClick={() => {
        if (!isSubmitting) {
          setIsOpen(false)
        }
        }}>
          <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#243040] rounded-[10px] px-[100px] py-[35px] motion-preset-slide-down motion-duration-300'>
              {schema && defaultValues && <CreateForm isSubmitting={isSubmitting} setIsOpen={setIsOpen} setIsSubmitting={setIsSubmitting} defaultValues={defaultValues} formType={formType} schema={schema} courseId={courseId}/>}
          </div>
      </div>
    }
    <button onClick={() => setIsOpen(true)} className='flex w-[97%] justify-center bg-[#6366F1] hover:bg-[#898BF4] py-[17px] rounded-[10px]'><span className='text-white text-[24px] font-sora font-semibold'>{buttonText}</span></button>
    </>
  )
}

export default AddModal