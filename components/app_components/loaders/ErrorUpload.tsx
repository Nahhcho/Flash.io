import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'

const ErrorUpload = ({ setIsOpen }: {  setIsOpen: Dispatch<SetStateAction<boolean>>}) => {
  return (
    <div className='flex flex-col items-center justify-center '>
      <div className="relative w-50 h-50">
        {/* your favicon, centered on top */}
        <Image
          src="/error.png"
          width={170}
          height={170}
          quality={100}
          alt="Uploading..."
          className="absolute inset-0 m-auto motion-preset-shake"
        />
      </div>
      <div className='flex flex-col items-center justify-center font-sora text-[26px]'>
        <span className='text-[#D84949]'>Error uploading files...</span>
        <span className='text-[18px] text-[#a0655d]'>Please email me at jimmyb0910202@gmail.com</span>
        <div onClick={() => {setIsOpen(false)}} className='flex mt-2 items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#a0655d] cursor-pointer hover:border-[#D84949]'>
            <p className='font-sora text-[#D84949] text-[18px] py-1'>Close</p> 
        </div>
      </div>
    </div>
  )
}

export default ErrorUpload