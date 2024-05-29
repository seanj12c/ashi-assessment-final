import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getDocs,
  setDoc,
  query,
  collection,
  where,
} from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/1.png";
import { IoReturnDownBack } from "react-icons/io5";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [lrn, setLRN] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = [];

      // Check if LRN already exists
      let lrnExists = false;
      const lrnSnapshot = await getDocs(
        query(collection(firestore, "users"), where("lrn", "==", lrn))
      );
      lrnSnapshot.forEach((doc) => {
        if (doc.exists()) {
          lrnExists = true;
        }
      });
      if (lrnExists) {
        errors.push("LRN already used<br>");
      }

      // Check if email already exists
      let emailExists = false;
      const emailSnapshot = await getDocs(
        query(collection(firestore, "users"), where("email", "==", email))
      );
      emailSnapshot.forEach((doc) => {
        if (doc.exists()) {
          emailExists = true;
        }
      });
      if (emailExists) {
        errors.push("Email already used<br>");
      }

      // Check if contact already exists
      let contactExists = false;
      const contactSnapshot = await getDocs(
        query(collection(firestore, "users"), where("contact", "==", contact))
      );
      contactSnapshot.forEach((doc) => {
        if (doc.exists()) {
          contactExists = true;
        }
      });
      if (contactExists) {
        errors.push("Contact already used<br>");
      }

      // Validate contact length
      if (contact.length !== 11) {
        errors.push("Contact must be 11 characters long<br>");
      }

      // Validate LRN length
      if (lrn.length !== 12) {
        errors.push("LRN must be 12 characters long<br>");
      }

      if (errors.length > 0) {
        throw new Error(errors.join(""));
      }

      // Proceed with user creation if LRN, email, and contact are unique
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        userId: user.uid,
        firstName,
        middleName,
        lastName,
        gender,
        contact,
        lrn,
        address,
        email,
        profilePhotoUrl:
          "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb",
      };

      await setDoc(doc(firestore, "users", user.uid), userData);

      Swal.fire({
        title: "Registration Successful!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Oops! The email is already in use";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Oops! You have inputted an invalid email.";
      }
     else if (error.code === "auth/weak-password") {
      errorMessage = "Oops! Your password should be atleast 6 characters";
    }
      Swal.fire({
        title: "Oops!",
        text: errorMessage,
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="place-items-center w-full h-screen flex justify-center items-center">
      <img
        className="z-[-1] absolute h-screen w-screen mx-auto object-cover pointer-events-none select-none"
        src={bg}
        alt="background"
      />
      <div className="w-full max-w-sm px-6 py-4 bg-white bg-opacity-90 rounded border glass relative z-10 flex flex-col justify-center items-center">
        <button className="flex justify-start w-full">
          <a
            href="https://amaya-capstone.vercel.app/"
            className="btn btn-xs flex gap-1 items-center btn-secondary text-white"
          >
            <IoReturnDownBack className="text-white" />
            Go back to Homepage
          </a>
        </button>
        <div className="mb-2">
          <h2 className="mt-2 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
            Register Now!
          </h2>
          <h1 className="text-center text-xs">
            Already have an account?{" "}
            <Link to="/" className="text-secondary font-bold">
              Register
            </Link>
          </h1>
        </div>
        <form className="space-y-2 w-full" onSubmit={handleSubmit}>
          <div className="flex gap-1">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="middle-name"
                className="block text-sm font-medium text-gray-700"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middle-name"
                placeholder="Optional"
                className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex gap-1">
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                className="mt-1 p-1 block border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="w-full">
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Contact
              </label>
              <input
                type="text"
                id="contact"
                className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                required
                maxLength="11"
                pattern="\d*"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lrn"
              className="block text-sm font-medium text-gray-700"
            >
              LRN (Learner Reference Number)
            </label>
            <input
              type="text"
              id="lrn"
              className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              required
              maxLength="12"
              pattern="\d*"
              value={lrn}
              onChange={(e) => setLRN(e.target.value)}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 p-1 block w-full border border-gray-300 rounded shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaRegEyeSlash className="text-gray-500" />
                ) : (
                  <FaRegEye className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-secondary w-full mt-2">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
