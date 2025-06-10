import React from 'react'
import { api } from '@/lib/api'
import SetCard from '@/components/app_components/cards/SetCard'
import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { error } from 'console'
import { ICourseDoc } from '@/database/course.model'
import AddModal from '@/components/app_components/modals/AddModal'
import Image from 'next/image'



const CourseDetails = async ({ params }: {params: Promise<{ courseId: string }>}) => {
  const { courseId } = await params;
  let res = await api.courses.getSets(courseId);
  
  if (!res.success) {
    console.log("Error fetching response: ", error)
  }

  const sets = res.success ? res.data as IFlashcardSetDoc[] : [];

  res = await api.courses.getById(courseId);
  console.log(res)
  const course = res.success ? res.data as ICourseDoc : null;
  

  return (
    <>
      <div className='col-start-4 col-end-13'>
        <div className='flex justify-between items-start'>
          <header className=' text-white text-[32px] font-sora font-semibold pb-[20px]'>{course?.title}</header>
          <Image className='cursor-pointer' src={"/settings.png"} width={50} height={50} quality={100} alt='settings' />
        </div>
      
          <hr className=' w-full border-[#2E3D52]  mb-[70px]'/>

          <p className='font-sora text-white text-[32px] pb-[25px]'>Upcoming Exam Sets</p>
      </div>
          
      <AddModal formType={"ADD_EXAM_SET"} />

      <div className='col-start-4 col-end-13'>
          <p className='font-sora text-white text-[32px] pb-[30px] mt-[100px]'>All Biology 101 Sets</p>

              <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] col-start-4 col-end-13'>
                  {sets.map((set: IFlashcardSetDoc) => (
                      <SetCard key={set.title} set={set}/>
                  ))}
              </div>
      </div>
      <AddModal formType={"ADD_SET"} courseId={courseId}/>
    </>
  )
}

export default CourseDetails