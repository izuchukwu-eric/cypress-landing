"use client"
import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Logo from "../../../../public/cypresslogo.svg"

const SignupFormSchema = z.object({ 
    email: z.string().describe('Email').email({ message: "Invalid Email" }),
    password: z.string().describe('Password').min(6, 'Password must be minimum 6 characters'),
    confirmPassword: z.string().describe("Confirm Password").min(6, 'Password must be minimum 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords, don't match.",
    path: ['ConfrimPassword']
})

const Signup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitError, setSubmitError] = useState('');
    const [confirmation, setConfirmation] = useState(false)

    const codeExachangeError = useMemo(() => {
        if(!searchParams) return '';
        return searchParams.get('error_description');
    }, [searchParams])

    const confirmationAndErrorStyles = useMemo(() => 
        clsx('bg-primary', {
            'bg-red-500/10': codeExachangeError,
            'border-red-500/50': codeExachangeError,
            'text-red-700': codeExachangeError 
        }), 
    [])

    const form = useForm<z.infer<typeof SignupFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(SignupFormSchema),
        defaultValues: { email: '', password: '', confirmPassword: ''}
    })

    const isLoading = form.formState.isSubmitting
    const onSubmit = () => {

    }

    const signUpHandler = () => {

    }
  return (
    <Form {...form}>
        <form
            onChange={() => {
                if(submitError) setSubmitError('')
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'
        >
            <Link href="/" className='w-full flex justify-left items-center'>
                <Image 
                    src={Logo}
                    alt='cypress Logo'
                    width={50}
                    height={50}
                />
                <span className='font-semibold dark:text-white text-4xl ml-2'>cypress</span>
            </Link>
            <FormDescription className="text-foreground/60">
                An all-In-One Collaboration and Productivity Platform
            </FormDescription>
            {!confirmation && !codeExachangeError && (
                <>
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name='email'
                        render={(field) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type='email'
                                        placeholder='Email'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name='password'
                        render={(field) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type='password'
                                        placeholder='Password'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full p-6' disabled={isLoading}>
                        {!isLoading ? 'Create Account' : <Loader />}
                    </Button>
                </>
            )}
            {submitError && <FormMessage>{submitError}</FormMessage>}
            <span className='self-center'>
                Already have an account?{' '}
                <Link href="/login" className='text-[#9333ea]'>
                    Sign In
                </Link>
            </span>
        </form>
    </Form>
  )
}

export default Signup