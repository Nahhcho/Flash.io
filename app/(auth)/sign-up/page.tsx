"use client";

import AuthForm from '@/components/app_components/forms/AuthForm'
import { SignUpSchema } from '@/lib/validations'
import React from 'react'

const SignUp = () => {
  return (
    <AuthForm type="SIGN_UP" schema={SignUpSchema} defaultValues={{
        email: "",
        password: "",
        confirmPassword: "",
        name: ""
    }}/>
  )
}

export default SignUp