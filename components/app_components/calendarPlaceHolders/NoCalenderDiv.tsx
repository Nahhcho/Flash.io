import React from 'react'
import AddModal from '../modals/AddModal'

const NoCalanderDiv = ({ type, courseName, courseId = "" }: { type: "Courses" | "StudyPlans", courseName?: string, courseId?: string}) => {
  let msg = ""
  let subMsg = ""

  switch (type) {
    case "Courses":
      msg = "You have no courses yet."
      subMsg = "Add your first course to kick-start personalized study plans—prep smart, stay ahead, and crush every exam."
      break;
    
    case "StudyPlans":
      msg = `You have no scheduled ${courseName!} exams.`
      subMsg = "Add your first exam to start building a personalized study guide—prep smart, stay ahead, and crush your next test."
      break;

    }

  return (
    <div className='border-4 border-dashed rounded-[10px] text-center mt-16 border-[#6366F1] flex flex-col items-center justify-center py-10'>
        <span className='font-sora text-white font-semibold text-[28px]'>
            {msg}
        </span>
        <span className='font-sora text-[20px] text-[#425775] font-semibold text-center w-[60%]'>
            {subMsg}
        </span>
        <div className='w-[30%] text-[18px] pt-8'>
          <AddModal formType={type === "Courses" ? 'ADD_COURSE' : "ADD_EXAM_SET"} courseId={courseId}/>
        </div>
    </div>
  )
}

export default NoCalanderDiv