import React from 'react';

function LoginPage() {
  return (
    // <div className="flex items-center justify-center h-screen bg-gray-100">
    //   <div className="bg-white rounded-2xl shadow-xl flex w-2/3 max-w-5xl">
    //     {/* Left Section (Image) */}
    //     <div className="w-3/5 p-5">
    //       <img
    //         src="https://i.imgur.com/9i8x3XF.jpeg" // Replace with your image URL
    //         alt="Login Image"
    //         className="rounded-2xl"
    //       />
    //       <div className="absolute bottom-10 left-10 text-white">
    //         <h2 className="text-2xl font-bold">Lorem Ipsum is simply</h2>
    //         <p className="text-sm">Lorem Ipsum is simply</p>
    //       </div>
    //     </div>

    //     {/* Right Section (Login Form) */}
    //     <div className="w-2/5 p-5">
    //       <div className="text-left font-bold">
    //         <span className="text-green-500">Welcome to lorem..!</span>
    //       </div>

    //       <div className="mt-5 flex justify-center">
    //         <button className="bg-green-500 text-white rounded-full px-4 py-2 mr-2">
    //           Login
    //         </button>
    //         <button className="bg-gray-200 text-gray-700 rounded-full px-4 py-2 ml-2">
    //           Register
    //         </button>
    //       </div>

    //       <p className="text-sm mt-5 text-gray-500">
    //         Lorem Ipsum is simply dummy text of the printing and typesetting
    //         industry.
    //       </p>

    //       {/* Username Input */}
    //       <div className="mt-8">
    //         <label className="block text-gray-700 text-sm font-bold mb-2">
    //           User name
    //         </label>
    //         <input
    //           className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //           id="username"
    //           type="text"
    //           placeholder="Enter your User name"
    //         />
    //       </div>

    //       {/* Password Input */}
    //       <div className="mt-4">
    //         <label className="block text-gray-700 text-sm font-bold mb-2">
    //           Password
    //         </label>
    //         <div className="relative">
    //           <input
    //             className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //             id="password"
    //             type="password"
    //             placeholder="Enter your Password"
    //           />
    //           <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer">
    //             {/* Replace with your visibility toggle icon (e.g., an eye icon) */}
    //             <svg
    //               className="h-5 w-5 text-gray-500"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 20 20"
    //               fill="currentColor"
    //               aria-hidden="true"
    //             >
    //               <path
    //                 fillRule="evenodd"
    //                 d="M10 12a2 2 0 100-4 2 2 0 000 4z"
    //                 clipRule="evenodd"
    //               />
    //               <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
    //             </svg>
    //           </span>
    //         </div>
    //       </div>

    //       {/* Remember Me & Forgot Password */}
    //       <div className="flex items-center justify-between mt-4">
    //         <label className="flex items-center">
    //           <input type="checkbox" className="mr-2 leading-tight" />
    //           <span className="text-sm">Rememebr me</span>
    //         </label>
    //         <a
    //           className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
    //           href="#"
    //         >
    //           Forgot Password?
    //         </a>
    //       </div>

    //       {/* Login Button */}
    //       <div className="mt-6">
    //         <button
    //           className="bg-green-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
    //           type="button"
    //         >
    //           Login
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='flex flex-row w-full h-screen'>
        <div className='h-screen w-1/2 bg-red-300'>
            <h1>Hello</h1>
        </div>
        <div className='flex flex-col items-center pt-10 h-screen w-1/2 bg-green-300'>
            <h1>Welcome to lorem</h1>

        </div>
    </div>
  );
}

export default LoginPage