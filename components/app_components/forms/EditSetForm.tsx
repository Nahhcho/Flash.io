"use client";

import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { IFlashcardDoc } from '@/database/flashcard.model'
import { EditFlashcardsSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface Props {
    set: IFlashcardSetDoc,
    flashcards: IFlashcardDoc[];
}

const EditSetForm = ({ set, flashcards }: Props ) => {
    const form = useForm<z.infer<typeof EditFlashcardsSchema>>({
        resolver: zodResolver(EditFlashcardsSchema),
        defaultValues: {
            flashcards: flashcards.map(f => ({
                _id: f._id.toString(),
                question: f.question,
                answer: f.answer
            }))
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "flashcards",
    });

  return (
    <form>
        {
            fields.map((field, i) => (
                <div key={field.id} className='col-start-4 col-end-13 flex flex-col mb-[50px] gap-[30px] bg-[#3D516D] rounded-[10px] py-4'>
                    <div>
                        <div className='flex justify-between items-baseline-last px-8'>
                            <p className='text-[26px] font-sora font-semibold text-[#2B3D54]'>{i+1}</p>
                            <Image onClick={() => remove(i)} src={'/trash.png'} height={30} width={30} quality={100} alt='delete' className='cursor-pointer' />
                        </div>
                        <hr className='border-[#576e92] mt-1'/>
                    </div>
                    <div className="flex items-start justify-between gap-[100px] px-8">
                        <div className='w-1/2'>
                            <textarea
                                {...form.register(`flashcards.${i}.question`)}
                                rows={1}
                                className="border-0 border-b-2 border-[#B1BDCD] bg-transparent text-white font-sora focus:outline-none resize-none w-full overflow-hidden text-[18px]"
                                onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                                }}
                            />
                            <span className='font-sora font-semibold text-[16px] text-[#2B3D54]'>TERM</span>
                        </div>
                        <div className='w-1/2'>
                            <textarea
                                {...form.register(`flashcards.${i}.answer`)}
                                rows={1}
                                className="border-0 border-b-2 border-[#B1BDCD] bg-transparent text-white font-sora focus:outline-none resize-none w-full overflow-hidden text-[18px]"
                                onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                                }}
                            />
                            <span className='font-sora font-semibold text-[16px] text-[#2B3D54]'>DEFINITION</span>
                        </div>
                    </div>
                </div>
            ))
        }
    </form>
  )
}

export default EditSetForm