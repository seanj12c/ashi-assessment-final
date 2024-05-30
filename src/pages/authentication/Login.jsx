import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/2.png";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Swal from "sweetalert2";
import { IoReturnDownBack } from "react-icons/io5";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setEmail("");
      setPassword("");
      setError("");

      if (
        userCredential.user.email === "amayaschoolofhomeindustries@gmail.com"
      ) {
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin/dashboard");
        });
      } else {
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/home");
        });
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Oops! Please recheck your information and submit again.");
      } else {
        setError(error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Forgot Password",

      input: "email",
      inputLabel: "Email address",
      inputPlaceholder: "Enter your email",
      confirmButtonColor: "#0D3A67",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Email address is required";
        }
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          title: "Password Reset Email Sent",
          text: `A password reset link has been sent to ${email}. Please check your inbox.`,
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <img
        className="z-[-1] absolute h-screen w-screen mx-auto object-cover pointer-events-none select-none"
        src={bg}
        alt="background"
      />
      <div className="max-w-md p-10 rounded-md border bg-gray-50 w-full space-y-8">
        <button>
          <a
            href="https://amaya-capstone.vercel.app/"
            className="btn btn-xs flex gap-1 items-center btn-secondary text-white"
          >
            <IoReturnDownBack className="text-white" />
            Go back to Homepage
          </a>
        </button>
        <div>
          <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <h1 className="text-center text-xs">
            If you don't have an account yet,{" "}
            <Link to="/register" className="text-secondary font-bold">
              Register
            </Link>
          </h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md space-y-1 shadow-sm ">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>

              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow"
                  placeholder="Email address"
                />
              </label>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="grow"
                  placeholder="Password"
                />
                {/* Show Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </label>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="text-xs">
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-secondary w-full text-white"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
