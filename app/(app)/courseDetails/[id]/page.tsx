import React from 'react'
import ProgressBar from '../../../../components/app_components/ProgressBar'
import { courses } from '../../../../components/app_components/Nav'
import CourseCard from '../../../../components/app_components/cards/CourseCard'
import QuizCard from '../../../../components/app_components/cards/QuizCard'
import { quizzes } from '../../page'
import AddSetModal from '../../../../components/app_components/forms/AddSetModal'
import AddExamModal from '../../../../components/app_components/forms/AddExamModal'



const CourseDetails = () => {
  return (
    <div className='col-start-4 col-end-13 min-h-screen'>
        <header className=' text-white text-[32px] font-sora font-semibold pb-[25px]'>Biology 101</header>
    
        <hr className=' w-full border-[#2E3D52]  mb-[70px]'/>

        <p className='font-sora text-white text-[32px] pb-[25px]'>Upcoming Exam Sets</p>
        
        <AddExamModal />

        <p className='font-sora text-white text-[32px] pb-[30px] mt-[100px]'>All Biology 101 Sets</p>

            <div className='grid grid-cols-3 gap-[20px] gap-y-[40px] pb-[30px] col-start-4 col-end-13'>
                {quizzes.map((quiz, index) => (
                    <QuizCard quiz={quiz} />
                ))}
            </div>
        
        <AddSetModal />
    </div>
  )
}

export default CourseDetails