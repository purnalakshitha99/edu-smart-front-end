import React, { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios, { AxiosError } from "axios";
import Swal from 'sweetalert2';

export function TeacherAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [teacherId, setTeacherId] = useState("");

    const backendURL = "http://127.0.0.1:5000";

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${backendURL}/auth/register`, {
                username,
                password,
                email,
                role: "teacher",
                teacherId,
            });

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'You have successfully registered.',
                }).then(() => {
                    setIsLogin(true);
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            let errorMessage = "Registration failed: An unknown error occurred.";
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as { message?: string } | undefined;
                errorMessage = `Registration failed: ${data?.message || axiosError.message}`;
            }
            Swal.fire({
                icon: 'error',
                title: 'Registration Error',
                text: errorMessage,
            });
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${backendURL}/auth/login`, {
                username,
                password,
                role: "teacher", //add this line
            });

            if (response.status === 200) {
                const token = response.data.access_token;
                localStorage.setItem("token", token);
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'You have successfully logged in.',
                }).then(() => {
                    window.location.href = "/teacher/dashboard"; // Redirect to teacher dashboard
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            let errorMessage = "Login failed: An unknown error occurred.";
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as { message?: string } | undefined;
                errorMessage = `Login failed: ${data?.message || axiosError.message}`;
            }
            Swal.fire({
                icon: 'error',
                title: 'Login Error',
                text: errorMessage,
            });
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    return (
        <div className="flex h-screen">
            <div className="relative hidden lg:flex lg:w-1/2">
                <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80"
                    alt="Teacher"
                    className="object-cover w-full"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-16 bg-gradient-to-b from-transparent to-black/70">
                    <h2 className="mb-4 text-5xl font-bold text-white">Teacher Portal</h2>
                    <p className="text-2xl text-white/90">Empower your teaching journey</p>
                </div>
            </div>

            <div className="flex flex-col justify-center w-full px-8 py-12 lg:w-1/2 sm:px-16 lg:px-24 bg-gradient-to-br from-green-50 to-green-100/50">
                <div className="w-full max-w-md mx-auto">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900">
                        {isLogin ? "Teacher Login" : "Teacher Registration"}
                    </h1>

                    <div className="flex p-1 mb-8 rounded-lg bg-white/80 backdrop-blur-sm">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md transition-all ${isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md transition-all ${!isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        value="Teacher"
                                        disabled
                                        className="w-full px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Teacher ID
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={teacherId}
                                        onChange={(e) => setTeacherId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                                        placeholder="Enter your teacher ID"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="font-medium text-green-600 hover:text-green-800"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}