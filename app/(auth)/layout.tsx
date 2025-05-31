import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode}) => {
  return (
    <div className='bg-[#1F2937] min-h-screen flex items-center justify-center'>
        {children}
    </div>
  )
}

export default layout