import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebaseConfig";
import Swal from "sweetalert2";
import logo from "../assets/ASHI_LOGO.png";
import { onSnapshot, doc } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(firestore, "users", userId);

        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
          } else {
            console.log("User document does not exist");
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    });

    if (confirmation.isConfirmed) {
      try {
        await auth.signOut();
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/home">Homepage</Link>
            </li>
            <li>
              <Link to="/view-results">View Results</Link>
            </li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <img class="w-12 object-contain" src={logo} alt="" />
      </div>
      <div class="navbar-end">
        <div class="dropdown dropdown-end">
          <div tabIndex="1" role="button" className="btn btn-ghost btn-circle">
            {userData && userData.profilePhotoUrl ? (
              <img
                src={userData.profilePhotoUrl}
                className="w-10 h-10 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div>
                <AiOutlineLoading3Quarters className="animate-spin" />
              </div>
            )}
          </div>
          <ul
            tabindex="1"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile">View Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
