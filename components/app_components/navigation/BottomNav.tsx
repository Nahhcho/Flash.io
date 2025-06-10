import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BottomNav = () => {
  return (
    <div className='col-span-12 w-full flex items-center justify-center bg-[#A78BFA] h-[60px] fixed bottom-0 left-0'>
        <Link href={`/`} className='flex items-center gap-1'>
            <Image src={'/home.png'} width={26} height={26} alt='home' />
        </Link>
    </div>
  )
}

export default BottomNav