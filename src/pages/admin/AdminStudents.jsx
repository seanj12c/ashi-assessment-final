import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import "tailwindcss/tailwind.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminNavbar from "./AdminNavbar";
import logo from "../../assets/ASHI_LOGO.png";
import { IoSearchSharp } from "react-icons/io5";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { MdEdit, MdOutlinePageview } from "react-icons/md";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        studentsData.sort((a, b) => a.lastName.localeCompare(b.lastName));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students data from Firestore:", error);
      }
    };

    fetchStudents();
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
    setCurrentPage(1);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearchTerm =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "" ||
      student.specialization === selectedSpecialization;

    return matchesSearchTerm && matchesSpecialization;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadDocx = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Amaya School of Home Industries",
              heading: "Title",
              alignment: "center",
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Name")] }),
                    new TableCell({ children: [new Paragraph("LRN")] }),
                    new TableCell({
                      children: [new Paragraph("Specialization")],
                    }),
                    new TableCell({ children: [new Paragraph("Status")] }),
                  ],
                }),
                ...filteredStudents.map(
                  (student) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph(
                              `${student.lastName}, ${student.firstName}, ${
                                student.middleName || "N/A"
                              }`
                            ),
                          ],
                        }),
                        new TableCell({
                          children: [new Paragraph(student.lrn)],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(student.specialization || "N/A"),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(
                              student.isDone ? "Enlisted" : "Not Enlisted"
                            ),
                          ],
                        }),
                      ],
                    })
                ),
              ],
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "students.docx");
    });
  };

  const handleEditSpecialization = async (
    studentId,
    student,
    currentSpecialization
  ) => {
    // Define the options for the Swal dropdown menu
    const specializationOptions = {
      Automotive: "Automotive",
      Cosmetology: "Cosmetology",
      Drafting: "Drafting",
      Electrical: "Electrical",
      Electronics: "Electronics",
      "Food and Beverages": "Food and Beverages",
      Garments: "Garments",
      Tourism: "Tourism",
      Welding: "Welding",
    };

    // Remove the current specialization from the options
    delete specializationOptions[currentSpecialization];

    // Show the Swal modal with the updated dropdown options
    Swal.fire({
      title: `Select Specialization for ${student.firstName}`,
      input: "select",
      inputOptions: specializationOptions,
      inputPlaceholder: "Select Specialization",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must select a specialization";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newSpecialization = result.value;
        updateSpecialization(
          studentId,
          currentSpecialization,
          newSpecialization
        );
      }
    });
  };

  const updateSpecialization = async (
    studentId,
    currentSpecialization,
    newSpecialization
  ) => {
    try {
      // Update the specialization in Firestore
      const studentDocRef = doc(firestore, "users", studentId);
      await updateDoc(studentDocRef, {
        specialization: newSpecialization,
      });

      // Decrement the count of the previous specialization
      if (currentSpecialization) {
        const previousSlotDocRef = doc(
          firestore,
          "slot",
          "Oq0uCfcbevIs4VlFLB4h"
        );
        await updateDoc(previousSlotDocRef, {
          [currentSpecialization.toLowerCase()]: increment(-1),
        });
      }

      // Increment the count of the new specialization
      const newSlotDocRef = doc(firestore, "slot", "Oq0uCfcbevIs4VlFLB4h");
      await updateDoc(newSlotDocRef, {
        [newSpecialization.toLowerCase()]: increment(1),
      });

      // Optionally, you can update the state to reflect the changes immediately
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? { ...student, specialization: newSpecialization }
            : student
        )
      );

      // Optionally, you can show a success message
      Swal.fire({
        title: `You have enlisted ${newSpecialization}`,
        icon: "success",
        confirmButtonColor: "#0D3A67",
        confirmButtonText: "Confirm",
      });
    } catch (error) {
      console.error("Error updating specialization:", error);
      // Optionally, you can show an error message
      Swal.fire({
        icon: "error",
        title: "Oops! Something went wrong.",
        text: "Unable to update specialization.",
      });
    }
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleViewResults = async (userId) => {
    try {
      // Fetch the user document from Firestore
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      // Check if the user has scores
      if (!userData || !userData.scores) {
        throw new Error("User scores not found");
      }

      // Extract scores from user data
      const scores = userData.scores;

      // Calculate progress percentage for each subject
      const progress = Object.fromEntries(
        Object.entries(scores).map(([subject, score]) => [
          subject,
          ((score / 15) * 100).toFixed(2),
        ])
      );

      // Generate HTML for the Swal modal
      const htmlContent = `
        <div class="space-y-4">
          <ul>
            ${Object.entries(scores)
              .map(
                ([subject, score]) => `
                  <li>
                    <div class="flex items-center justify-between">
                      <span>${subject}</span>
                      <span class="ml-4">${score}/15</span>
                    </div>
                    <div class="bg-gray-200 h-6 rounded-lg mt-2">
                      <div class="bg-blue-500 h-full rounded-lg" style="width: ${progress[subject]}%"></div>
                    </div>
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      `;

      // Display scores with progress in Swal modal
      Swal.fire({
        title: `Scores of ${userData.firstName} ${userData.lastName}`,
        html: htmlContent,
        confirmButtonText: "Close",
        confirmButtonColor: "#0D3A67",
        customClass: {
          title: "text-xl font-semibold mb-4",
          htmlContainer: "py-4",
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
        },
      });
    } catch (error) {
      console.error("Error fetching user scores:", error);
      Swal.fire({
        icon: "error",
        title: "Oops! Something went wrong.",
        text: "Unable to fetch user scores.",
      });
    }
  };

  return (
    <div className="h-full">
      <AdminNavbar className="md:hidden" />
      <div className="flex h-screen bg-gray-100">
        <Sidebar className="h-full" handleLogout={handleLogout} />

        <div className="flex-1 p-6 overflow-x-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Students</h1>
          <div className="mb-4 flex flex-col md:flex-row justify-between gap-1">
            <div className="p-2 border w-full bg-white items-center border-gray-300 rounded-lg flex gap-1">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
              <IoSearchSharp />
            </div>
            <select
              value={selectedSpecialization}
              onChange={handleSpecializationChange}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Specializations</option>
              <option value="Automotive">Automotive</option>
              <option value="Cosmetology">Cosmetology</option>
              <option value="Drafting">Drafting</option>
              <option value="Electrical">Electrical</option>
              <option value="Electronics">Electronics</option>
              <option value="Food and Beverages">Food and Beverages</option>
              <option value="Garments">Garments</option>
              <option value="Tourism">Tourism</option>
              <option value="Welding">Welding</option>
            </select>
          </div>
          <div className="mb-4 flex justify-center md:justify-start">
            <button
              onClick={downloadDocx}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Download DOCX
            </button>
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LRN
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enlist Date
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-medium text-gray-900">
                        {`${student.lastName}, ${student.firstName}, ${
                          student.middleName || "N/A"
                        }`}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-xs text-center md:text-sm text-gray-500">
                        {student.lrn}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-xs text-center md:text-sm text-gray-500">
                        {student.specialization
                          ? student.specialization
                          : "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={`px-2 text-center inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isDone
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isDone ? "Enlisted" : "Not Enlisted"}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-xs text-center md:text-sm text-gray-500">
                        {student.enlistDate || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6 flex justify-center whitespace-nowrap ">
                      <div className="text-xs flex gap-2 text-center md:text-sm text-gray-500">
                        <button
                          className="btn btn-sm btn-square btn-secondary"
                          onClick={() =>
                            handleEditSpecialization(
                              student.id,
                              student,
                              student.specialization
                            )
                          }
                          disabled={!student.isDone} // Disable button if student is not enlisted
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          className="btn btn-sm btn-square btn-secondary"
                          onClick={() =>
                            handleViewResults(
                              student.id,
                              student,
                              student.specialization
                            )
                          }
                          disabled={!student.isDone} // Disable button if student is not enlisted
                        >
                          <MdOutlinePageview size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            <nav aria-label="Page navigation">
              <ul className="inline-flex -space-x-px">
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i}>
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                        currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                    aria-label="Next"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>
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
        <img src={logo} className="w-32 mx-auto object-contain" alt="" />
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

export default AdminStudents;
