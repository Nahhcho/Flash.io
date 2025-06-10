"use client";

import React, { useState } from 'react';
import CreateForm from '../forms/CreateForm';
import { CreateCourseWithMaterialsSchema, CreateExamSetHookForm, CreateSetHookForm } from '@/lib/validations';

type ModalProps = {
  formType: "ADD_COURSE" | "ADD_SET" | "ADD_EXAM_SET";
  courseId?: string;
}

const AddModal = ({ formType, courseId = "" }: ModalProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const buttonText = formType === "ADD_COURSE" ? "Add Course" : formType === "ADD_EXAM_SET" ? "Add Exam Set" : "Add Set";
    const schema = formType === "ADD_COURSE" ? CreateCourseWithMaterialsSchema : formType === "ADD_EXAM_SET" ? CreateExamSetHookForm : CreateSetHookForm 
  return (
    <>
    { isOpen &&
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen' onClick={() => {setIsOpen(false)}}>
        <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px] motion-preset-slide-down motion-duration-300'>
            <CreateForm courseId={courseId} formType={formType} schema={schema} />
        </div>
    </div>
}
    <button onClick={() => setIsOpen(true)} className='col-start-4 col-end-7 flex w-[97%] justify-center mt-[40px] bg-[#6366F1] hover:bg-[#898BF4] py-[17px] rounded-[10px]'><span className='text-white text-[24px] font-sora font-semibold'>{buttonText}</span></button>
    
    </>
  )
}

export default AddModal