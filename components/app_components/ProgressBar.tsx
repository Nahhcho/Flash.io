import React from 'react'


const ProgressBar = ({ progress, displayHome = false }: { progress: number, displayHome: boolean }) => {
  let msg = ""
  if (displayHome) {
    if (progress === 100) {
      msg = "All quizzes done for today. Good work!"
    } else {
      msg = "Consistency beats cramming. Keep going!"
    }
  }
  
  return (
    <div className='w-full h-[23px] bg-[#3D516D] rounded-[25px]'>
        <div style={{
                width: `${progress}%`,
            ...(progress > 99 && {borderTopRightRadius: "25px"}),
            ...(progress > 99 &&  {borderBottomRightRadius: "25px"})
            }} className='rounded-tl-[25px] rounded-bl-[25px] h-[23px] bg-[#6366F1]'>   
        </div>
        {displayHome &&
          <span className='flex font-sora text-[22px] justify-center pt-[17px] text-white'>{msg}</span>
        }
    </div>
  )
}

export default ProgressBar