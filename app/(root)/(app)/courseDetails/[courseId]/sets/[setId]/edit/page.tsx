import EditSetForm from '@/components/app_components/forms/EditSetForm';
import { api } from '@/lib/api'
import React from 'react'

const EditSet = async ({ params }: { params: { courseId: string, setId: string }} ) => {
  const { courseId, setId } = await params;

  const res = (await api.FlashcardSets.getSetAndFlashcards(setId));
  console.log(res);
  if (!res.success) return null
  const { flashcards, set } = res.data;
  console.log(res)

  return (
    <div className='col-start-4 col-end-13'>
    
        <header className=' text-white text-[32px] font-sora font-semibold pb-[20px]'>{set.title}</header>

        <hr className=' w-full border-[#2E3D52]  mb-[70px]'/>

        <EditSetForm set={set} flashcards={flashcards} />
    </div>
  )
}

export default EditSet