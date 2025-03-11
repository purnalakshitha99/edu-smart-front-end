import React from 'react';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">TORC</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/courses" className="text-gray-700 hover:text-gray-900">Courses</Link>
            <Link to="/exams" className="text-gray-700 hover:text-gray-900">Exams</Link>
            <Link to="/company" className="text-gray-700 hover:text-gray-900">Company</Link>
            <Link to="/blog" className="text-gray-700 hover:text-gray-900">Blog</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About Us</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-500" />
            <User className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;



// import React from 'react';
// import { Search, User } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex items-center">
//             <Link to="/" className="text-2xl font-bold text-blue-600">TORC</Link>
//           </div>
          
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
//             <Link to="/courses" className="text-gray-700 hover:text-gray-900">Courses</Link>
//             <Link to="/exams" className="text-gray-700 hover:text-gray-900">Exams</Link>
//             <Link to="/company" className="text-gray-700 hover:text-gray-900">Company</Link>
//             <Link to="/blog" className="text-gray-700 hover:text-gray-900">Blog</Link>
//             <Link to="/about" className="text-gray-700 hover:text-gray-900">About Us</Link>
//           </div>

//           <div className="flex items-center space-x-4">
//             <Search className="h-5 w-5 text-gray-500" />
//             {/* Login Button */}
//             <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//               Login
//             </Link>
//             <User className="h-5 w-5 text-gray-500" />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;