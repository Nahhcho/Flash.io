"use client";

import { ROUTES } from '@/constants/routes';
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { DefaultValues, FieldValues, useForm } from 'react-hook-form'
import { ZodType } from 'zod'

type AuthFormType<T> = {
    type: "SIGN_IN" | "SIGN_UP",
    schema: ZodType<T>,
    defaultValues: T
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues }: AuthFormType<T>) => {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const buttonText = type === "SIGN_IN" ? "Sign in" : "Sign up";
    
    const handleSubmit = async () => {

    }

    return (
    <div className='flex flex-col bg-[#6366F1] p-[40px] w-[500px] rounded-[8px]'>
        <div className='flex justify-between items-center mb-[15px]'>
            <div className='font-sora text-white'>
                <header className='font-semibold text-[32px]'>Join NeuroNote</header>
                <p className=''>Start studying smarter today</p>
            </div>
            <Image src={'/favicon.png'} height={80} width={80} quality={100} alt='favicon'/>
        </div>
    <form className='flex flex-col gap-8' onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-4'>
        {Object.keys(defaultValues).map((field, idx) => (
            <div key={idx} className='flex flex-col'>
            <p className='text-white font-sora'>{field === "confirmPassword" ? "Confirm Password" : field[0].toUpperCase() + field.slice(1)}</p>
            <input className='
            bg-white font-sora border-1 border-[#A6A8FF] rounded-[8px] h-[45px] pl-2
            ' type={field === "password" || field === "confirmPassword" ? "password" : "text"} placeholder={field === "confirmPassword" ? "confirm password" : field}/>
            </div>
        ))}
        </div>
        <div className='flex flex-col gap-2'>
            <button type='submit' className='bg-[#A78BFA] rounded-[8px] h-[45px] font-sora text-white font-semibold hover:bg-[#b49bff] cursor-pointer'>{buttonText}</button>
            {
                type === "SIGN_UP" ? (
                    <span className='flex items-center font-sora gap-2 text-white'>Already have an account?<Link href={ROUTES.SIGN_IN}><p className='font-sora text-[#A78BFA] font-semibold hover:text-[#5f31ea]'>Sign in</p></Link></span>
                ) : (
                    <span className='flex items-center font-sora gap-2 text-white'>Don&apos;t have an account?<Link href={ROUTES.SIGN_UP}><p className='font-sora text-[#A78BFA] font-semibold hover:text-[#5f31ea]'>Sign up</p></Link></span>
                )
            }
        </div>
    </form>
    <button onClick={async () => {
        signIn("google", { callbackUrl: "/" })
    }} className='flex gap-2 bg-white rounded-[8px] h-[45px] items-center justify-center cursor-pointer mt-4'>
        <Image src={"/google.png"} width={25} height={20} quality={100} alt='google_img'/>
        <p className='font-medium'>Login with Google</p>
    </button>
    </div>
  )
}

export default AuthForm