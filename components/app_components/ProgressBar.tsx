import React from 'react'


const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className='w-full h-[23px] bg-[#3D516D] rounded-[25px]'>
        <div style={{
                width: `${progress}%`,
            ...(progress > 99 && {borderTopRightRadius: "25px"}),
            ...(progress > 99 &&  {borderBottomRightRadius: "25px"})
            }} className='rounded-tl-[25px] rounded-bl-[25px] h-[23px] bg-[#6366F1]'>   
        </div>
    </div>
  )
}

export default ProgressBar