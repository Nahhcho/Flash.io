import Link from 'next/link'
import React from 'react'

const CourseCard = ( {_id, title }: {_id: string, title: string}) => {

  return (
    <Link href={`/courseDetails/${_id}`}>
    <div className='flex px-[30px] justify-center items-center bg-[#3D516D] hover:bg-[#4F6B92] cursor-pointer rounded-[10px] h-[250px]'>
        <header className='font-sora font-semibold text-[20px] text-white'>{title}</header>
    </div>
    </Link>
  )
}

export default CourseCard