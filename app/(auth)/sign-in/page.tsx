"use client";

import AuthForm from '@/components/app_components/forms/AuthForm'
import { SignInSchema } from '@/lib/validations'
import React from 'react'

const SignIn = () => {
  return (
    <AuthForm type='SIGN_IN' schema={SignInSchema} defaultValues={{email: "", password: ""}}/>
  )
}

export default SignIn