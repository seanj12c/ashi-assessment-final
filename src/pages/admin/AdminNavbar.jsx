import React from "react";
import logo from "../../assets/ASHI_LOGO.png";
import Swal from "sweetalert2";
import { auth } from "../../firebaseConfig";

import { FaCalendar } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { PiStudent } from "react-icons/pi";
const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to log out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        auth
          .signOut()
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      }
    });
  };
  return (
    <div className="navbar relative z-50 md:hidden bg-base-100">
      <div className="flex-none">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>

            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              <img
                src={logo}
                alt="Logo"
                className="h-20 mx-auto object-contain"
              />
              <li className="pt-5">
                <Link to="/admin/dashboard">
                  <FaCalendar className="text-secondary" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/students">
                  <PiStudent className="text-secondary" />
                  Students
                </Link>
              </li>
              <li>
                <button
                  className="w-full btn btn-error text-white btn-sm mt-16"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <img src={logo} alt="Logo" className="h-12" />
      </div>
    </div>
  );
};

export default AdminNavbar;
