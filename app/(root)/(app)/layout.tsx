import React from 'react'
import Nav from '../../../components/app_components/navigation/Nav'
import { SessionProvider } from "next-auth/react";
import { auth } from '@/auth';

const layout = async ({children}: {children: React.ReactNode}) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
        <div className='grid grid-cols-12 px-[120px] pb-[120px] pt-[48px] bg-[#1F2937]'>
          <Nav />
          {children}
        </div>
    </SessionProvider>
  )
}

export default layout