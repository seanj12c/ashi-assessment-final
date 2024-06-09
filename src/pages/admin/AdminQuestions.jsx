import React, { useEffect, useState } from "react";
import {
  getDocs,
  doc,
  updateDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import "tailwindcss/tailwind.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminNavbar from "./AdminNavbar";
import logo from "../../assets/ASHI_LOGO.png";

const AdminQuestions = () => {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedSpecializationName, setSelectedSpecializationName] =
    useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    type: "",
    answer: "",
  });
  const [isOn, setIsOn] = useState(true);

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
    const fetchSpecializations = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "SpecializationQuestions")
        );
        const fetchedSpecializations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpecializations(fetchedSpecializations);
        console.log("Fetched Specializations: ", fetchedSpecializations); // Debug log
      } catch (error) {
        console.error("Error fetching specializations: ", error);
      }
    };
    const fetchToggleState = async () => {
      try {
        const docRef = doc(firestore, "questionToggle", "7N1ubM0POj85NyeINj0v");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsOn(docSnap.data().isOn);
        }
      } catch (error) {
        console.error("Error fetching toggle state: ", error);
      }
    };

    fetchSpecializations();
    fetchToggleState();
  }, []);

  const toggleQuestion = async () => {
    try {
      const docRef = doc(firestore, "questionToggle", "7N1ubM0POj85NyeINj0v");
      await updateDoc(docRef, { isOn: !isOn });
      setIsOn(!isOn);
    } catch (error) {
      console.error("Error toggling question: ", error);
    }
  };

  useEffect(() => {
    if (selectedSpecialization) {
      const spec = specializations.find(
        (spec) => spec.id === selectedSpecialization
      );
      setQuestions(spec.questions || []);
      setSelectedSpecializationName(spec.specialization);
      console.log("Selected Specialization Questions: ", spec.questions); // Debug log
    }
  }, [selectedSpecialization, specializations]);

  const handleAddQuestion = async () => {
    const { question, options, type, answer } = newQuestion;

    if (
      question.trim() === "" ||
      type.trim() === "" ||
      answer.trim() === "" ||
      (type === "multiple-choice" &&
        options.some((option) => option.trim() === ""))
    ) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Question",
        text: "Please fill out all fields.",
      });
      return;
    }

    const updatedQuestions = [...questions, newQuestion];
    const specializationRef = doc(
      firestore,
      "SpecializationQuestions",
      selectedSpecialization
    );
    try {
      await updateDoc(specializationRef, { questions: updatedQuestions });
      setQuestions(updatedQuestions);
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        type: "",
        answer: "",
      });
    } catch (error) {
      console.error("Error adding question: ", error);
    }
  };

  const handleEditQuestion = async (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    const specializationRef = doc(
      firestore,
      "SpecializationQuestions",
      selectedSpecialization
    );
    try {
      await updateDoc(specializationRef, { questions: updatedQuestions });
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error editing question: ", error);
    }
  };

  const handleDeleteQuestion = async (index) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this question?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirmation.isConfirmed) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      const specializationRef = doc(
        firestore,
        "SpecializationQuestions",
        selectedSpecialization
      );
      try {
        await updateDoc(specializationRef, { questions: updatedQuestions });
        setQuestions(updatedQuestions);
        Swal.fire("Deleted!", "The question has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting question: ", error);
        Swal.fire(
          "Error!",
          "An error occurred while deleting the question.",
          "error"
        );
      }
    }
  };

  const handleInputChange = (e, field, index) => {
    const updatedQuestion = { ...newQuestion };
    if (field === "options") {
      updatedQuestion.options[index] = e.target.value;
    } else {
      updatedQuestion[field] = e.target.value;
    }
    setNewQuestion(updatedQuestion);
  };

  const handleOptionChange = (e, index) => {
    const options = [...newQuestion.options];
    options[index] = e.target.value;
    setNewQuestion({ ...newQuestion, options });
  };

  const handleAddOption = () => {
    const options = [...newQuestion.options, ""];
    setNewQuestion({ ...newQuestion, options });
  };

  const handleDeleteOption = (index) => {
    const options = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options });
  };

  const handleEditButtonClick = (index) => {
    const questionToEdit = questions[index];

    Swal.fire({
      title: "Edit Question",
      html: `
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="swal-question" class="text-sm font-semibold">Question:</label>
              <input id="swal-question" class="swal2-input" value="${
                questionToEdit.question || ""
              }" placeholder="Enter question text">
            </div>
            ${
              questionToEdit.type !== "identification"
                ? `<div>
              <label for="swal-option1" class="text-sm font-semibold">Option 1:</label>
              <input id="swal-option1" class="swal2-input" value="${
                questionToEdit.options[0] || ""
              }" placeholder="Enter option 1">
            </div>
            <div>
              <label for="swal-option2" class="text-sm font-semibold">Option 2:</label>
              <input id="swal-option2" class="swal2-input" value="${
                questionToEdit.options[1] || ""
              }" placeholder="Enter option 2">
            </div>
            <div>
              <label for="swal-option3" class="text-sm font-semibold">Option 3:</label>
              <input id="swal-option3" class="swal2-input" value="${
                questionToEdit.options[2] || ""
              }" placeholder="Enter option 3">
            </div>
            <div>
              <label for="swal-option4" class="text-sm font-semibold">Option 4:</label>
              <input id="swal-option4" class="swal2-input" value="${
                questionToEdit.options[3] || ""
              }" placeholder="Enter option 4">
            </div>`
                : ""
            }
            <div>
              <label for="swal-answer" class="text-sm font-semibold">Answer:</label>
              <input id="swal-answer" class="swal2-input" value="${
                questionToEdit.answer || ""
              }" placeholder="Enter answer">
            </div>
          </div>
        `,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        const editedQuestion = {
          question: document.getElementById("swal-question").value,
          options: [
            document.getElementById("swal-option1")
              ? document.getElementById("swal-option1").value || ""
              : "",
            document.getElementById("swal-option2")
              ? document.getElementById("swal-option2").value || ""
              : "",
            document.getElementById("swal-option3")
              ? document.getElementById("swal-option3").value || ""
              : "",
            document.getElementById("swal-option4")
              ? document.getElementById("swal-option4").value || ""
              : "",
          ],
          type: questionToEdit.type || "",
          answer: document.getElementById("swal-answer").value || "",
        };

        handleEditQuestion(index, editedQuestion);
      },
    });
  };

  return (
    <div className="h-full">
      <AdminNavbar className="md:hidden" />
      <div className="flex h-screen bg-gray-100">
        <Sidebar handleLogout={handleLogout} />
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="flex flex-col md:flex-row text-xs md:text-base items-center justify-around">
            <div>
              <h1>
                The Assessment is Currently:{" "}
                <span
                  className={`text-${
                    isOn ? "green-800" : "error"
                  } font-bold text-lg md:text-xl`}
                >
                  {isOn ? "Accessible" : "Not Accessible"}
                </span>
              </h1>
            </div>
            <button
              className={`btn btn-xs md:btn-sm btn-${
                isOn ? "error text-white" : "success"
              }`}
              onClick={toggleQuestion}
            >
              Make it {isOn ? "Not Accessible" : "Accessible"}
            </button>
          </div>

          <div className="max-w-4xl text-black mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Questions Panel</h1>
            <div className="mb-6">
              <label className="block text-black text-lg font-medium mb-2">
                Select Specialization:
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md text-black" // Add text-black class
              >
                <option value="" disabled>
                  Select specialization
                </option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.specialization}
                  </option>
                ))}
              </select>
            </div>

            {selectedSpecialization && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Questions for{" "}
                  {
                    specializations.find(
                      (spec) => spec.id === selectedSpecialization
                    ).specialization
                  }
                </h2>
                <a
                  href="#add_question"
                  className="btn btn-primary btn-sm font-semibold mb-4"
                >
                  Add question for{" "}
                  {
                    specializations.find(
                      (spec) => spec.id === selectedSpecialization
                    ).specialization
                  }
                </a>
                <ul className="space-y-4">
                  {questions.map((question, index) => (
                    <li key={index} className="border p-4 rounded-md shadow-sm">
                      <p>
                        <strong>Question:</strong> {question.question}
                      </p>
                      <p>
                        <strong>Options:</strong>{" "}
                        <ul>
                          {question.options.map((option, idx) => (
                            <li key={idx}>{option}</li>
                          ))}
                        </ul>
                      </p>
                      <p>
                        <strong>Type:</strong> {question.type}
                      </p>
                      <p>
                        <strong>Answer:</strong> {question.answer}
                      </p>
                      <button
                        onClick={() => handleEditButtonClick(index)}
                        className="btn btn-secondary mr-2 btn-xs md:btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="btn btn-error text-white btn-xs md:btn-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <h3
                  id="add_question"
                  className="text-lg font-semibold mt-6 mb-4"
                >
                  Add New Question for {selectedSpecializationName}
                </h3>
                <div className="border p-4 rounded-md shadow-sm space-y-4">
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) => handleInputChange(e, "question")}
                    placeholder="Question"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={newQuestion.type}
                    onChange={(e) => handleInputChange(e, "type")}
                    placeholder="Type"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="identification">Identification</option>
                    <option value="multiple-choice">Multiple Choice</option>
                  </select>
                  {newQuestion.type === "multiple-choice" && (
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Options:
                      </label>
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(e, index)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 mr-2 p-2 border border-gray-300 rounded-md"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => handleDeleteOption(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={handleAddOption}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={newQuestion.answer}
                    onChange={(e) => handleInputChange(e, "answer")}
                    placeholder="Answer"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="btn btn-primary"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            )}
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

export default AdminQuestions;
