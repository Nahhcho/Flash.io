import ProgressBar from '@/components/app_components/ProgressBar'
import React from 'react'

const answers = ["Liver", "Mitochondra", "Reverse Osmosis", "Mitosis"]

const CourseQuiz = () => {
  return (
    <div className='col-start-4 col-end-13 h-screen'>
        <header className='col-start-4 col-end-13 text-white text-[32px] font-sora font-semibold pb-[25px]'>Biology 101</header>
        
        <hr className=' w-full border-[#2E3D52] col-start-4 col-end-13'/>
        
        <div className='col-start-4 col-end-13 flex items-center justify-center gap-[60px] pt-[60px]'>
            <span className='text-white font-sora text-[26px] font-semibold'>Question 1</span>
            <div className='flex-1 flex items-center justify-center'>
                <ProgressBar />
            </div>
        </div>

        {/*Question goes into this div*/}

        <div className='col-start-4 col-end-13 flex justify-center items-center rounded-[10px] bg-[#6366F1] py-[60px] mt-[50px]'>
            <span className='font-sora font-semibold text-[32px] text-white'>Which is the powerhouse of the cell</span>
        </div>
        
        <div className='col-start-4 col-end-13 grid grid-cols-2 gap-x-[80px] pt-[40px] gap-[40px]'>
            {answers.map((answer, index) => (
                <div className='font-sora text-[32px] text-white cursor-pointer bg-[#3D516D] hover:bg-[#4F6B92] flex justify-center items-center py-[60px] rounded-[10px]'>
                    {answer}
                </div>
            ))}
        </div>
        
    </div>
  )
}

export default CourseQuiz