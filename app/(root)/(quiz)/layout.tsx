import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid grid-cols-12 px-[120px] pt-[40px] '>
        {children}
    </div>
  )
}

export default layout