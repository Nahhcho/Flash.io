import React from 'react'
import Nav from '../../components/app_components/Nav'
import { SessionProvider } from "next-auth/react";

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SessionProvider>
      <div className='grid grid-cols-12 px-[120px] pb-[120px] pt-[48px] bg-[#1F2937]'>
        <Nav />
        {children}
      </div>
    </SessionProvider>
  )
}

export default layout