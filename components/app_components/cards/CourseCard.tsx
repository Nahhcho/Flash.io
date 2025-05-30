import Link from 'next/link'
import React from 'react'

interface Props {
    title: string
}

const CourseCard = ({ title }: Props ) => {
  return (
    <Link href={`/courseDetails/1`}>
    <div className='flex justify-center items-center bg-[#3D516D] hover:bg-[#4F6B92] cursor-pointer rounded-[10px] h-[250px]'>
        <header className='font-sora font-semibold text-[20px] text-white'>{title}</header>
    </div>
    </Link>
  )
}

export default CourseCard