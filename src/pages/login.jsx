import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { signIn, getSession } from "next-auth/react";
import { useRouter } from 'next/router';

const errorMessages = {
    CredentialsSignin: 'Incorrect email or password.',
    OAuthSignin: 'Could not start Google sign-in. Please try again.',
    OAuthCallback: 'Google sign-in failed. Please try again.',
    Default: 'Something went wrong. Please try again.',
};

const Login = () => {
    const [load, setLoad] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const authError = router.query.error
        ? (errorMessages[router.query.error] ?? errorMessages.Default)
        : null;

    useEffect(() => {
        setLoad(true);
    }, []);

    const handleLogin = () => {
        signIn('credentials', {
            email,
            password,
            callbackUrl: `${window.location.origin}/dashboard`
        });
    };

    const handleGoogleLogin = () => {
        signIn('google', {
            callbackUrl: `${window.location.origin}/dashboard`
        });
    };

    return (
        <div className={`min-h-screen flex flex-col ${load ? 'opacity-100 transition-opacity duration-1000 ease-in-out' : 'opacity-0'}`}>
            <Link href='/' className="fixed top-0 left-0 py-2 px-4 text-4xl text-white" aria-label="Back to home">
                &#8592;
            </Link>
            <main id="main-content" className="flex flex-1 flex-col md:flex-row items-center justify-center bg-stone-950">
                <section className="h-5/6 w-5/6 mt-20 bg-stone-900 p-8 rounded-lg shadow-md mx-4 mb-8 flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold text-stone-100 mb-6">Login to Your Account</h1>

                    {authError && (
                        <p role="alert" className="w-full mb-4 text-sm text-red-400 bg-red-950 border border-red-800 rounded px-4 py-2">
                            {authError}
                        </p>
                    )}

                    <button
                        className="bg-rose-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-rose-500"
                        onClick={handleGoogleLogin}
                    >
                        Sign in with Google
                    </button>
                    <div className="flex items-center space-x-2 m-6 w-full">
                        <hr className="flex-1 border-stone-600" />
                        <p className="text-stone-400">OR</p>
                        <hr className="flex-1 border-stone-600" />
                    </div>
                    <label className="w-full flex flex-col mb-4">
                        <span className="text-stone-300 text-sm mb-1">Email</span>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border-2 border-stone-600 rounded text-stone-100 bg-stone-800 focus:border-rose-500"
                            placeholder="you@example.com"
                            aria-required="true"
                        />
                    </label>
                    <label className="w-full flex flex-col mb-6">
                        <span className="text-stone-300 text-sm mb-1">Password</span>
                        <input
                            type='password'
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border-2 border-stone-600 rounded text-stone-100 bg-stone-800 focus:border-rose-500"
                            placeholder="Password"
                            aria-required="true"
                        />
                    </label>
                    <button
                        className="bg-rose-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-rose-500"
                        onClick={handleLogin}
                    >
                        Enter
                    </button>
                </section>
                <section className="w-5/6 bg-stone-900 p-8 rounded-lg shadow-md mx-4 lg:mb-0 flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold text-stone-100 mb-2">New User?</h1>
                    <p className="text-stone-300 mb-6">Sign up to start building your own digital cookbook!</p>
                    <Link href='/signup' className="bg-rose-600 text-white font-bold py-2 px-4 rounded w-full text-center hover:bg-rose-500">
                        Sign up
                    </Link>
                </section>
            </main>
        </div>
    );
};

export default Login;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return { redirect: { destination: '/dashboard' } };
    }

    return { props: {} };
};
