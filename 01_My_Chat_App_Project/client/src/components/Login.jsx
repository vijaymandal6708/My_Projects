import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-slate-800 text-white p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-bold text-center">
            Welcome Back
          </h1>

          <h2 className="text-center text-gray-400 mt-2 mb-6">
            Login to your account
          </h2>

          <div className="space-y-5">

            {/* Email */}
            <label className="input validator w-full bg-slate-900">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="mail@site.com"
                className="w-full bg-transparent outline-none"
                required
              />
            </label>

            {/* Password */}
            <label className="input validator w-full bg-slate-900">
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none"
                required
              />
            </label>

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
            >
              Login
            </button>

            {/* Signup Link */}
            <p className="text-sm text-center mt-3 text-gray-400">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:underline"
              >
                Sign Up
              </Link>
            </p>

          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
