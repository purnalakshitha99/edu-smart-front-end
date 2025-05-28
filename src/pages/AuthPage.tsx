import React, { useEffect, useState, FormEvent, useRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Eye, EyeOff } from "lucide-react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

function AuthPage() {
<<<<<<< HEAD
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
=======
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [studentYear, setStudentYear] = useState("");
    const [studentId, setStudentId] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [errors, setErrors] = useState<{
        email?: string;
        studentYear?: string;
        studentId?: string;
        address?: string;
        gender?: string;
        username?: string;
        password?: string;
    }>({});
>>>>>>> 2266413d60e60e5c089fd133703fcfb66a7b18f7

  const backendURL = "http://127.0.0.1:5000";

<<<<<<< HEAD
  const clearFormFields = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRegister = async () => {
    setIsLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("role", "student");
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      const response = await axios.post(
        `${backendURL}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
=======
    const clearFormFields = () => {
        setUsername("");
        setPassword("");
        setEmail("");
        setProfilePicture(null);
        setStudentYear("");
        setStudentId("");
        setAddress("");
        setGender("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
>>>>>>> 2266413d60e60e5c089fd133703fcfb66a7b18f7
        }
      );

      if (response.status === 201) {
        Swal.fire({
          // SweetAlert for successful registration
          icon: "success",
          title: "Registration Successful!",
          text: "You have successfully registered.",
        });
        setIsLogin(true);
        clearFormFields(); // Clear the form after successful registration
      } else {
        Swal.fire({
          // SweetAlert for registration failure
          icon: "error",
          title: "Registration Failed",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed: An unknown error occurred.";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const data = axiosError.response?.data as
          | { message?: string }
          | undefined;
        errorMessage = `Registration failed: ${
          data?.message || axiosError.message
        }`;
      } else if (error instanceof Error) {
        errorMessage = `Registration failed: ${error.message}`;
      } else {
        errorMessage = "Registration failed: An unexpected error occurred.";
      }

      Swal.fire({
        // SweetAlert for registration error
        icon: "error",
        title: "Registration Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    // Initialize username from localStorage and listen for changes
    const initialUsername = localStorage.getItem("username") || "";
    setUsername(initialUsername);

    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username") || "");
    };

    window.addEventListener("storage", handleStorageChange);

<<<<<<< HEAD
    return () => {
      window.removeEventListener("storage", handleStorageChange);
=======
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("email", email);
            formData.append("role", "student");
            formData.append("student_year", studentYear);
            formData.append("student_id", studentId);
            formData.append("address", address);
            formData.append("gender", gender);
            if (profilePicture) {
                formData.append("profile_picture", profilePicture);
            }

            const response = await axios.post(`${backendURL}/auth/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                Swal.fire({  // SweetAlert for successful registration
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'You have successfully registered.',
                });
                setIsLogin(true);
                clearFormFields();  // Clear the form after successful registration
            } else {
                Swal.fire({  // SweetAlert for registration failure
                    icon: 'error',
                    title: 'Registration Failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("Registration error:", error);

            let errorMessage = "Registration failed: An unknown error occurred.";

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as { message?: string } | undefined;
                errorMessage = `Registration failed: ${data?.message || axiosError.message}`;
            } else if (error instanceof Error) {
                errorMessage = `Registration failed: ${error.message}`;
            } else {
                errorMessage = "Registration failed: An unexpected error occurred.";
            }

            Swal.fire({  // SweetAlert for registration error
                icon: 'error',
                title: 'Registration Error',
                text: errorMessage,
            });
        } finally {
            setIsLoading(false); // Stop loading
        }
>>>>>>> 2266413d60e60e5c089fd133703fcfb66a7b18f7
    };
  }, []);

  const handleLogin = async () => {
    ``;
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(`${backendURL}/auth/login`, {
        username: username,
        password: password,
        role: "student", //add this line
      });

      console.log(response);

      if (response.status === 200) {
        const token = response.data.access_token;
        const userid = response.data.user_id;
        const imageurl = response.data.image;
        const fetchedUsername = response.data.username;

        localStorage.setItem("token", token);
        localStorage.setItem("userid", userid);
        localStorage.setItem("imageurl", imageurl);
        localStorage.setItem("username", username);

<<<<<<< HEAD
        if (fetchedUsername) {
          // Check if username is defined
          localStorage.setItem("username", fetchedUsername);
        } else {
          console.warn("Username is undefined in the response.");
          localStorage.removeItem("username");
=======
    const handleLogin = async () => {``
        setIsLoading(true); // Start loading
        try {
            const response = await axios.post(`${backendURL}/auth/login`, {
                username: username,
                password: password,
                role: "student", //add this line
            });

            console.log(response)

            if (response.status === 200) {
                const token = response.data.access_token;
                const userid = response.data.user_id;
                const imageurl = response.data.image;
               const fetchedUsername = response.data.username; 
                
                localStorage.setItem("token", token);
                localStorage.setItem("userid",userid)
                localStorage.setItem("imageurl", imageurl)
                localStorage.setItem("username", username)
                
                
                if (fetchedUsername) { // Check if username is defined
                    localStorage.setItem("username", fetchedUsername);
                } else {
                    console.warn("Username is undefined in the response.");
                    localStorage.removeItem("username")
                }


                // localStorage.setItem("id", );
                Swal.fire({  // SweetAlert for successful login
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'You have successfully logged in.',
                }).then(() => {
                    clearFormFields();
                    window.location.href = "/";  // Redirect after SweetAlert is closed
                });

            } else {
                Swal.fire({  // SweetAlert for login failure
                    icon: 'error',
                    title: 'Login Failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("Login error:", error);

            let errorMessage = "Login failed: An unknown error occurred.";

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as { message?: string } | undefined;
                errorMessage = `Login failed: ${data?.message || axiosError.message}`;
            } else if (error instanceof Error) {
                errorMessage = `Login failed: ${error.message}`;
            } else {
                errorMessage = "Login failed: An unexpected error occurred.";
            }

            Swal.fire({  // SweetAlert for login error
                icon: 'error',
                title: 'Login Error',
                text: errorMessage,
            });
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        
        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // // Student ID validation
        // if (!studentId) {
        //     newErrors.studentId = "Student ID is required";
        // } else if (!/^\d{8}$/.test(studentId)) {
        //     newErrors.studentId = "Student ID must be 8 digits";
        // }

        // Grade validation
        if (!studentYear) {
            newErrors.studentYear = "Grade is required";
        }

        // Address validation
        if (!address) {
            newErrors.address = "Address is required";
        } else if (address.length < 10) {
            newErrors.address = "Address must be at least 10 characters";
        }

        // Gender validation
        if (!gender) {
            newErrors.gender = "Gender is required";
        }

        // Username validation
        if (!username) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        // // Password validation
        // if (!password) {
        //     newErrors.password = "Password is required";
        // } else if (password.length < 6) {
        //     newErrors.password = "Password must be at least 6 characters";
        // } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
        //     newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            if (validateForm()) {
                handleRegister();
            }
>>>>>>> 2266413d60e60e5c089fd133703fcfb66a7b18f7
        }

        // localStorage.setItem("id", );
        Swal.fire({
          // SweetAlert for successful login
          icon: "success",
          title: "Login Successful!",
          text: "You have successfully logged in.",
        }).then(() => {
          clearFormFields();
          window.location.href = "/"; // Redirect after SweetAlert is closed
        });
      } else {
        Swal.fire({
          // SweetAlert for login failure
          icon: "error",
          title: "Login Failed",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed: An unknown error occurred.";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const data = axiosError.response?.data as
          | { message?: string }
          | undefined;
        errorMessage = `Login failed: ${data?.message || axiosError.message}`;
      } else if (error instanceof Error) {
        errorMessage = `Login failed: ${error.message}`;
      } else {
        errorMessage = "Login failed: An unexpected error occurred.";
      }

      Swal.fire({
        // SweetAlert for login error
        icon: "error",
        title: "Login Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false); // Stop loading
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

<<<<<<< HEAD
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    } else {
      setProfilePicture(null);
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen">
      <div className="relative hidden lg:flex lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
          alt="Student Learning"
          className="object-cover w-full"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-16 bg-gradient-to-b from-transparent to-black/70">
          <h2 className="mb-4 text-5xl font-bold text-white">Student Portal</h2>
          <p className="text-2xl text-white/90">
            Your gateway to learning and growth
          </p>
=======
                    {isLogin ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Login form fields */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Sign In"}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col h-[calc(100vh-250px)]">
                            <div className="flex-1 overflow-y-auto pr-2">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) {
                                                    setErrors(prev => ({ ...prev, email: undefined }));
                                                }
                                            }}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Grade
                                        </label>
                                        <select
                                            required
                                            value={studentYear}
                                            onChange={(e) => {
                                                setStudentYear(e.target.value);
                                                if (errors.studentYear) {
                                                    setErrors(prev => ({ ...prev, studentYear: undefined }));
                                                }
                                            }}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
                                                errors.studentYear ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Grade</option>
                                            <option value="6">Grade 6</option>
                                            <option value="7">Grade 7</option>
                                            <option value="8">Grade 8</option>
                                            <option value="9">Grade 9</option>
                                            <option value="10">Grade 10</option>
                                            <option value="11">Grade 11</option>
                                            <option value="12">Grade 12</option>
                                            <option value="13">Grade 13</option>
                                        </select>
                                        {errors.studentYear && (
                                            <p className="mt-1 text-sm text-red-500">{errors.studentYear}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Student ID Number
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={studentId}
                                            onChange={(e) => {
                                                setStudentId(e.target.value);
                                                if (errors.studentId) {
                                                    setErrors(prev => ({ ...prev, studentId: undefined }));
                                                }
                                            }}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
                                                errors.studentId ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your student ID number"
                                        />
                                        {errors.studentId && (
                                            <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <textarea
                                            required
                                            value={address}
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                                if (errors.address) {
                                                    setErrors(prev => ({ ...prev, address: undefined }));
                                                }
                                            }}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your address"
                                            rows={3}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Gender
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={gender === "male"}
                                                    onChange={(e) => {
                                                        setGender(e.target.value);
                                                        if (errors.gender) {
                                                            setErrors(prev => ({ ...prev, gender: undefined }));
                                                        }
                                                    }}
                                                    className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-600">Male</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={gender === "female"}
                                                    onChange={(e) => {
                                                        setGender(e.target.value);
                                                        if (errors.gender) {
                                                            setErrors(prev => ({ ...prev, gender: undefined }));
                                                        }
                                                    }}
                                                    className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-600">Female</span>
                                            </label>
                                        </div>
                                        {errors.gender && (
                                            <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                if (errors.username) {
                                                    setErrors(prev => ({ ...prev, username: undefined }));
                                                }
                                            }}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
                                                errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your username"
                                        />
                                        {errors.username && (
                                            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                                        )}
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
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) {
                                                        setErrors(prev => ({ ...prev, password: undefined }));
                                                    }
                                                }}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
                                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
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
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Profile Picture
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                                            ref={fileInputRef}
                                        />
                                        {profilePicture && (
                                            <div className="mt-2">
                                                <img
                                                    src={URL.createObjectURL(profilePicture)}
                                                    alt="Profile Preview"
                                                    className="object-cover w-24 h-24 rounded-full"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePicture}
                                                    className="mt-1 text-sm text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="flex-none pt-4 mt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Loading..." : "Create Account"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
>>>>>>> 2266413d60e60e5c089fd133703fcfb66a7b18f7
        </div>
      </div>

      <div className="flex flex-col justify-center w-full px-8 py-12 lg:w-1/2 sm:px-16 lg:px-24 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <div className="w-full max-w-md mx-auto">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            {isLogin ? "Student Login" : "Student Registration"}
          </h1>

          <div className="flex p-1 mb-8 rounded-lg bg-white/80 backdrop-blur-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                !isLogin
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                    ref={fileInputRef}
                  />

                  {profilePicture && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Profile Preview"
                        className="object-cover w-24 h-24 rounded-full"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePicture}
                        className="mt-1 text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
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
                    className="mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading
                ? "Loading..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
