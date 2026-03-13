import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Navbar from "../components/navbar";
import Loading from "../components/loading";

const Signup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const { email, username, password } = formData;
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        }
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            newErrors.username = 'Username should only contain letters and numbers';
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { username, email, password, passwordConfirm } = formData;
        if (password !== passwordConfirm) {
            setFormError("Passwords do not match");
            return;
        }

        setFormError('');
        const res = await fetch('/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        const result = await res.json();
        if (result.email) {
            setFormError('That email is already in use');
            return;
        }
        if (result.username) {
            setFormError('That username is already in use');
            return;
        }

        router.push('/login');
    };

    return (
        <div className="flex flex-col h-screen bg-stone-950">
            <Navbar />
            <main id="main-content" className={`flex items-center justify-center h-screen bg-stone-950 ${load ? 'opacity-100 transition-opacity duration-500 ease-in-out' : 'opacity-0'}`}>
                <section className="bg-stone-900 border border-stone-700 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-stone-100">Create an account</h1>
                    <form className="flex flex-col space-y-4" noValidate>
                        <label className="flex flex-col">
                            <span className="text-stone-300 font-medium mb-1">Email</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                aria-required="true"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                className="border border-stone-600 rounded-lg py-2 px-4 text-stone-100 bg-stone-800 focus:border-rose-500"
                            />
                            {errors.email && <span id="email-error" role="alert" className="text-red-400 text-sm mt-1">{errors.email}</span>}
                        </label>
                        <label className="flex flex-col">
                            <span className="text-stone-300 font-medium mb-1">Username</span>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                aria-required="true"
                                aria-invalid={!!errors.username}
                                aria-describedby={errors.username ? "username-error" : undefined}
                                className="border border-stone-600 rounded-lg py-2 px-4 text-stone-100 bg-stone-800 focus:border-rose-500"
                            />
                            {errors.username && <span id="username-error" role="alert" className="text-red-400 text-sm mt-1">{errors.username}</span>}
                        </label>
                        <label className="flex flex-col">
                            <span className="text-stone-300 font-medium mb-1">Password</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleInputChange}
                                aria-required="true"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                className="border border-stone-600 rounded-lg py-2 px-4 text-stone-100 bg-stone-800 focus:border-rose-500"
                            />
                            {errors.password && <span id="password-error" role="alert" className="text-red-400 text-sm mt-1">{errors.password}</span>}
                        </label>
                        <label className="flex flex-col">
                            <span className="text-stone-300 font-medium mb-1">Confirm Password</span>
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="Confirm Password"
                                value={formData.passwordConfirm}
                                onChange={handleInputChange}
                                aria-required="true"
                                className="border border-stone-600 rounded-lg py-2 px-4 text-stone-100 bg-stone-800 focus:border-rose-500"
                            />
                        </label>
                        {formError && <p role="alert" className="text-red-400 text-sm font-medium">{formError}</p>}
                        <button className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Create account</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Signup;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session) {
        return { redirect: { destination: '/dashboard' } };
    }
    return { props: {} };
};
