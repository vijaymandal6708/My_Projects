// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmpassword: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setError(""); // clear error while typing
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, password, confirmpassword } = formData;

//     // 🔹 Frontend Validation
//     if (!name || !email || !password || !confirmpassword) {
//       return setError("All fields are required");
//     }

//     if (password !== confirmpassword) {
//       return setError("Passwords do not match");
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:5002/user/signup",
//         formData
//       );

//       setLoading(false);

//       alert("Signup Successful");

//       // Success
//       navigate("/login");

//     } catch (err) {
//       setLoading(false);

//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Something went wrong");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-slate-800 text-white p-8 rounded-xl shadow-lg"
//       >
//         <h1 className="text-3xl font-bold text-center">
//           Create a new account
//         </h1>

//         <h2 className="text-center text-gray-400 mt-2 mb-6">
//           It's free and always will be
//         </h2>

//         <div className="space-y-4">

//           {/* Error Message */}
//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}

//           {/* Name */}
//           <label className="input w-full bg-slate-900">
//             <input
//               type="text"
//               name="name"
//               onChange={handleChange}
//               placeholder="Username"
//               className="w-full bg-transparent outline-none"
//               required
//             />
//           </label>

//           {/* Email */}
//           <label className="input w-full bg-slate-900">
//             <input
//               type="email"
//               name="email"
//               onChange={handleChange}
//               placeholder="mail@site.com"
//               className="w-full bg-transparent outline-none"
//               required
//             />
//           </label>

//           {/* Password */}
//           <label className="input w-full bg-slate-900">
//             <input
//               type="password"
//               name="password"
//               onChange={handleChange}
//               placeholder="Password"
//               className="w-full bg-transparent outline-none"
//               required
//             />
//           </label>

//           {/* Confirm Password */}
//           <label className="input w-full bg-slate-900">
//             <input
//               type="password"
//               name="confirmpassword"
//               onChange={handleChange}
//               placeholder="Confirm Password"
//               className="w-full bg-transparent outline-none"
//               required
//             />
//           </label>

//           {/* Button */}
//           <button
//             type="submit"
//             className="btn btn-primary w-full"
//             disabled={loading}
//           >
//             {loading ? "Creating..." : "Sign Up"}
//           </button>

//           {/* Login Link */}
//           <p className="text-sm text-center text-gray-400">
//             Have an account?{" "}
//             <Link
//               to="/login"
//               className="text-blue-400 hover:underline"
//             >
//               Login
//             </Link>
//           </p>

//         </div>
//       </form>
//     </div>
//   );
// };

// export default Signup;







// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-md bg-slate-800 text-white p-8 rounded-xl shadow-lg"
//         >
//           <h1 className="text-3xl font-bold text-center">
//             Welcome Back
//           </h1>

//           <h2 className="text-center text-gray-400 mt-2 mb-6">
//             Login to your account
//           </h2>

//           <div className="space-y-5">

//             {/* Email */}
//             <label className="input validator w-full bg-slate-900">
//               <input
//                 type="email"
//                 name="email"
//                 onChange={handleChange}
//                 placeholder="mail@site.com"
//                 className="w-full bg-transparent outline-none"
//                 required
//               />
//             </label>

//             {/* Password */}
//             <label className="input validator w-full bg-slate-900">
//               <input
//                 type="password"
//                 name="password"
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="w-full bg-transparent outline-none"
//                 required
//               />
//             </label>

//             {/* Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-full mt-2"
//             >
//               Login
//             </button>

//             {/* Signup Link */}
//             <p className="text-sm text-center mt-3 text-gray-400">
//               Don’t have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-blue-400 hover:underline"
//               >
//                 Sign Up
//               </Link>
//             </p>

//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Login;
