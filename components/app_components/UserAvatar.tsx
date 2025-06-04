import Image from 'next/image'
import React from 'react'

const UserAvatar = ({ image }: {image?: string | null}) => {
  return (
    <>
        {image ? (
            <Image className='rounded-full' src={image} quality={100} width={60} height={60} alt='userImage'/>
        ) : (
            <div className=''></div>
        )}
    </>
  )
}

export default UserAvatar