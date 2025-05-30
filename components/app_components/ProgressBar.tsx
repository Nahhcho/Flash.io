import React from 'react'

const dailyProgress = 50
const ProgressBar = () => {
  return (
    <div className='w-full h-[23px] bg-[#3D516D] rounded-[25px]'>
        <div style={{
                width: `${dailyProgress}%`,
            ...(dailyProgress > 99 && {borderTopRightRadius: "25px"}),
            ...(dailyProgress > 99 &&  {borderBottomRightRadius: "25px"})
            }} className='rounded-tl-[25px] rounded-bl-[25px] h-[23px] bg-[#6366F1]'>   
        </div>
    </div>
  )
}

export default ProgressBar