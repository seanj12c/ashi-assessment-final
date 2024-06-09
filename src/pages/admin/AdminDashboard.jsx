import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import "tailwindcss/tailwind.css";
import Chart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import logo from "../../assets/ASHI_LOGO.png";

const AdminDashboard = () => {
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [numberOfStudentsEnlisted, setNumberOfStudentsEnlisted] = useState(0);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userSnapshot, slotSnapshot] = await Promise.all([
          getDocs(collection(firestore, "users")),
          getDocs(collection(firestore, "slot")),
        ]);
        const students = userSnapshot.docs;
        const slotData = slotSnapshot.docs[0].data(); // Assuming there's only one document in the "slot" collection

        let studentCount = 0;
        let enrolledStudentCount = 0;

        const specializationCounts = {
          Automotive: 0,
          Cosmetology: 0,
          Drafting: 0,
          Electrical: 0,
          Electronics: 0,
          "Food and Beverages": 0,
          Garments: 0,
          Tourism: 0,
          Welding: 0,
        };

        students.forEach((student) => {
          studentCount++;
          const specialization = student.data().specialization;
          if (specialization) {
            enrolledStudentCount++;
          }
          if (specializationCounts[specialization] !== undefined) {
            specializationCounts[specialization]++;
          }
        });

        setNumberOfStudents(studentCount);
        setNumberOfStudentsEnlisted(enrolledStudentCount);

        const specializationLabels = Object.keys(specializationCounts);
        const specializationValues = Object.values(specializationCounts);

        setChartOptions({
          chart: {
            type: "bar",
          },
          xaxis: {
            categories: specializationLabels,
          },
          yaxis: {
            min: 0,
            max: 250,
            tickAmount: 25,
          },
        });
        setChartSeries([
          {
            name: "Number of Students",
            data: specializationValues,
          },
        ]);

        // Get slot data
        const slotsData = {
          Automotive: slotData.automotive,
          Cosmetology: slotData.cosmetology,
          Drafting: slotData.drafting,
          Electrical: slotData.electrical,
          Electronics: slotData.electronics,
          "Food and Beverages": slotData["food and beverages"],
          Garments: slotData.garments,
          Tourism: slotData.tourism,
          Welding: slotData.welding,
        };

        setSlots(slotsData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
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
    <div className="h-full">
      <AdminNavbar className="md:hidden" />
      <div className="flex h-screen">
        <Sidebar handleLogout={handleLogout} />

        <div className="flex-1 p-6 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:gap-6">
            <div className="grid grid-cols-1 pb-3 md:grid-cols-3 gap-2">
              <StatCard title="Students" value={numberOfStudents} />
              <StatCard title="Specializations" value={9} />
              <StatCard
                title="Student Enlisted"
                value={numberOfStudentsEnlisted}
              />
            </div>
          </div>
          <div className="col-span-3 pb-3 md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Student Enlisted</h2>
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={400}
              />
            </div>
          </div>
          <div className="col-span-3 md:flex-row gap-2 flex flex-col items-center justify-center">
            <div className="bg-white shadow-md w-full rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Available Slots</h3>
              <div className="space-y-2 w-full">
                {Object.entries(slots).map(([key, value]) => (
                  <div key={key} className="w-full">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {key}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {value} slots left
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 h-4 rounded-full mt-1">
                      <div
                        className="absolute top-0 h-4 rounded-full bg-blue-600"
                        style={{
                          width: `${((value / 250) * 100).toFixed(2)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <DatePicker
                selected={currentDate}
                onChange={(date) => setCurrentDate(date)}
                inline
              />
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

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-lg w-full p-4 md:p-6">
    <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
    <p className="text-xl md:text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
