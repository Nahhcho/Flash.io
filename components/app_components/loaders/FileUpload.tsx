import Image from 'next/image'
import React from 'react'

const FileUpload = ({ message }: { message: string }) => {
  return (
    <div className='flex flex-col items-center justify-center '>
      <div className="relative w-50 h-50">
        {/* spinning ring */}
        <div
          className="
            absolute inset-0
            rounded-full
            border-4
            border-indigo-200
            border-t-indigo-500
            animate-spin
          "
        />
        {/* your favicon, centered on top */}
        <Image
          src="/favicon.png"
          width={80}
          height={80}
          quality={100}
          alt="Uploading..."
          className="absolute inset-0 m-auto motion-preset-pulse motion-duration-1000"
        />
      </div>
      <div className='flex flex-col items-center justify-center font-sora text-white text-[26px] pt-4'>
        <span>{ message }</span>
        <span className='text-[18px] text-[#5e7ca4]'>Generation may take up to a minute</span>
        <div className='flex mt-2 items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#A78BFA] cursor-pointer hover:border-[#b8a3f8]'>
            <p className='font-sora text-white text-[18px] py-1'>Abort</p> 
        </div>
      </div>
    </div>
  )
}

export default FileUpload