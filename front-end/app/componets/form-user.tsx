'use client';

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { login, register as session } from '@/app/api/auth';

const loginSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum(['student', 'manager']).default('student'),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type FormUserData = LoginData | RegisterData;

export function FormUser() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const schema = isLogin ? loginSchema : registerSchema;
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormUserData>({
        resolver: zodResolver(schema)
    });

    const handleFormUser = async (data: FormUserData) => {
        setError(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                const { email, password } = data as LoginData;
                await login({ email, password });

                router.push('/courses');
            } else {
                const { name, email, password, role } = data as RegisterData;
                await session({ name, email, password, role });
                
                router.push('/courses');
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearErrorAndReset = () => {
        setError(null);
        reset();
    };

    const onSubmit = (data: FormUserData) => {
        clearErrorAndReset();
        handleFormUser(data);
    };

    const buttonText = isLogin ? 'Sign in' : 'Create an account';
    const headerText = isLogin ? 'Sign in to your account' : 'Create an account';
    const subheaderText = isLogin ? 'Log in to access your space course and continue learning.' : 'Sign up to access your space course and start learning.';

    return (
        <div className="mt-12 w-full max-w-sm rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-md lg:mt-0">
            <h2 className="text-3xl font-semibold text-white">{headerText}</h2>
            <p className="mt-2 text-sm text-gray-300">
                {subheaderText}
            </p>
            <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}
                {!isLogin && (
                    <>
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">Name</label>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder="name"
                                className="block w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                            {'name' in errors && errors.name && (
                                <p className="mt-1 text-sm text-red-400">{(errors as Record<string, any>).name?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-300">Account Type</label>
                            <select
                                {...register('role')}
                                className="block w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="student" className="bg-gray-800 text-white">Student</option>
                                <option value="manager" className="bg-gray-800 text-white">Manager</option>
                            </select>
                            {'role' in errors && errors.role && (
                                <p className="mt-1 text-sm text-red-400">{(errors as Record<string, any>).role?.message}</p>
                            )}
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">Your email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="name@company.com"
                        className="block w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{(errors.email as any).message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className="block w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                        required
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-400">{(errors.password as any).message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-purple-600 p-3 font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? 'Processing...' : buttonText}
                </button>
                {isLogin ? (
                    <p className="mt-4 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <a onClick={() => { setIsLogin(false); clearErrorAndReset(); }} className="font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300 cursor-pointer">
                            Create account
                        </a>
                    </p>
                ) : (
                    <p className="mt-4 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <a onClick={() => { setIsLogin(true); clearErrorAndReset(); }} className="font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300 cursor-pointer">
                            Sign in
                        </a>
                    </p>
                )}
            </form>
        </div>
    );
}