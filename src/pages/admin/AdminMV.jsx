import React, { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import "tailwindcss/tailwind.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminNavbar from "./AdminNavbar";
import logo from "../../assets/ASHI_LOGO.png";

const AdminMV = () => {
  const navigate = useNavigate();
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");

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

  useEffect(() => {
    const fetchMissionAndVision = async () => {
      try {
        const docRef = doc(firestore, "cms", "index");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMission(data.mission);
          setVision(data.vision);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchMissionAndVision();
  }, []);

  const handleMissionChange = (e) => {
    setMission(e.target.value);
  };

  const handleVisionChange = (e) => {
    setVision(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(firestore, "cms", "index");
      await updateDoc(docRef, {
        mission: mission,
        vision: vision,
      });
      Swal.fire(
        "Saved!",
        "Mission and Vision updated successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error updating document:", error);
      Swal.fire("Error!", "Failed to update Mission and Vision.", "error");
    }
  };
  return (
    <div className="h-full">
      <AdminNavbar className="md:hidden" />
      <div className="flex h-screen bg-gray-100">
        <Sidebar handleLogout={handleLogout} />
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="max-w-xl mx-auto border p-5 bg-white rounded-lg">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900">
              Edit Mission and Vision
            </h1>
            <div className="mb-8">
              <label
                htmlFor="mission"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Mission
              </label>
              <textarea
                id="mission"
                name="mission"
                rows="6"
                value={mission}
                onChange={handleMissionChange}
                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-2 border-gray-300 rounded-md"
                placeholder="Enter mission statement..."
              ></textarea>
            </div>
            <div className="mb-8">
              <label
                htmlFor="vision"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Vision
              </label>
              <textarea
                id="vision"
                name="vision"
                rows="6"
                value={vision}
                onChange={handleVisionChange}
                className="mt-1 p-2  block w-full shadow-sm sm:text-sm border-2 border-gray-300 rounded-md"
                placeholder="Enter vision statement..."
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Sidebar = ({ handleLogout }) => (
  <div className="w-64 hidden justify-between bg-gray-800 text-white md:flex flex-col">
    <div>
      <div className="p-4 text-lg font-semibold">
        <img src={logo} className="w-32 mx-auto object-contain" alt="logo" />
      </div>
      <ul>
        <Link to="/admin/dashboard">
          <li className="p-4 hover:bg-gray-700 cursor-pointer">Dashboard</li>
        </Link>
        <Link to="/admin/students">
          <li className="p-4 hover:bg-gray-700 cursor-pointer">Students</li>
        </Link>
        <Link to="/admin/mission_vision">
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            Mission & Vision
          </li>
        </Link>
        <Link to="/admin/personnel">
          <li className="p-4 hover:bg-gray-700 cursor-pointer">Personnel</li>
        </Link>
        <Link to="/admin/questions">
          <li className="p-4 hover:bg-gray-700 cursor-pointer">Questions</li>
        </Link>
        <button
          onClick={handleLogout}
          className="p-4 hover:bg-gray-700 w-full cursor-pointer text-left"
        >
          Logout
        </button>
      </ul>
    </div>
    <div className="pb-2">
      <h1 className="text-xs text-center w-full">
        Amaya School of Home Industries <br /> Admin Panel
      </h1>
    </div>
  </div>
);

export default AdminMV;
