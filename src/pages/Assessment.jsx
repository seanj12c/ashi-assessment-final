import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { auth, firestore } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Assessment = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of specializations to display per page
  const [shuffledSpecializationQuestions, setShuffledSpecializationQuestions] =
    useState([]);

  // Shuffle function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const checkPreviousAssessment = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(firestore, "users", userId);
      const userData = await getDoc(userRef);

      if (userData.exists()) {
        const userScores = userData.data().scores || {};
        if (Object.keys(userScores).length > 0) {
          Swal.fire({
            icon: "info",
            title: "You already answered the pre-assessment",
            text: "We're sorry, you cannot try again.",
          }).then(() => {
            navigate("/home");
          });
        } else {
          const docRef = doc(
            firestore,
            "questionToggle",
            "7N1ubM0POj85NyeINj0v"
          );
          const docSnap = await getDoc(docRef);
          const isOn = docSnap.data().isOn;

          if (!isOn) {
            Swal.fire({
              icon: "info",
              title: "Sorry, assessment is closed by the admin",
              text: "Please try again later.",
            }).then(() => {
              navigate("/home");
            });
          }
        }
      }
    };

    const fetchSpecializationQuestions = async () => {
      const questionsCollection = collection(
        firestore,
        "SpecializationQuestions"
      );
      const questionsSnapshot = await getDocs(questionsCollection);
      const questionsList = questionsSnapshot.docs.map((doc) => doc.data());

      // Shuffle specializations and their questions
      const shuffledSpecializations = shuffleArray([...questionsList]);
      shuffledSpecializations.forEach((specialization) => {
        specialization.questions = shuffleArray([...specialization.questions]);
      });
      setShuffledSpecializationQuestions(shuffledSpecializations);
      console.log("Shuffled Questions: ", shuffledSpecializations);
    };

    checkPreviousAssessment();
    fetchSpecializationQuestions();

    // eslint-disable-next-line
  }, [navigate]);

  const [answers, setAnswers] = useState([
    Array(15).fill(""), // For Tourism
    Array(15).fill(""), // For Automotive
    Array(15).fill(""), // For Drafting
    Array(15).fill(""), // For Electrical
    Array(15).fill(""), // For Electronics
    Array(15).fill(""), // For Welding
    Array(15).fill(""), // For Garments
    Array(15).fill(""), // For Cosmetology
    Array(15).fill(""), // For FoodandBeverages
  ]);

  // Function to handle user input for each question
  const handleAnswerChange = (specializationIndex, questionIndex, event) => {
    const newAnswers = [...answers];
    newAnswers[specializationIndex][questionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  // Function to calculate scores for all specializations
  const calculateScores = () => {
    const scores = shuffledSpecializationQuestions.map(
      (specializationObj, specializationIndex) => {
        let score = 0;
        answers[specializationIndex].forEach((userAnswer, index) => {
          if (
            userAnswer.toLowerCase() ===
            specializationObj.questions[index].answer.toLowerCase()
          ) {
            score += 1;
          }
        });
        return { specialization: specializationObj.specialization, score };
      }
    );
    return scores;
  };

  const handleSubmit = async () => {
    // Set submitted to true
    setSubmitted(true);

    // Check if all questions have been answered
    const allAnswered = answers.every((specializationAnswers) =>
      specializationAnswers.every((answer) => answer.trim() !== "")
    );

    if (!allAnswered) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please answer all questions before submitting.",
      }).then(() => {
        // Scroll to the first unanswered question
      });
      return;
    }

    const scores = calculateScores();
    const userId = auth.currentUser.uid;

    try {
      const userRef = doc(firestore, "users", userId);
      const userData = await getDoc(userRef);

      if (userData.exists()) {
        const userScores = userData.data().scores || {};
        scores.forEach((scoreObj) => {
          userScores[scoreObj.specialization] = scoreObj.score;
        });
        await setDoc(
          userRef,
          { scores: userScores, isDone: true },
          { merge: true }
        );
      } else {
        // Create new user data with scores
        const userScores = {};
        scores.forEach((scoreObj) => {
          userScores[scoreObj.specialization] = scoreObj.score;
        });
        await setDoc(userRef, { scores: userScores });
      }

      Swal.fire({
        icon: "success",
        title: "Submit Complete!",
        text: "You will now see your scores and specialization",
      }).then(() => {
        navigate("/view-results");
      });
    } catch (error) {
      console.error("Error saving scores to the database:", error);
      alert("An error occurred while saving scores. Please try again later.");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shuffledSpecializationQuestions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    shuffledSpecializationQuestions.length / itemsPerPage
  );

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Assessment</h1>
        <p>
          <span className="font-bold underline">Instruction</span>: Please
          answer each question <span className="font-bold">carefully</span> and{" "}
          <span className="font-bold">honestly</span>, as this will impact your
          specialization. <span className="font-bold">Take your time</span>,
          ensure <span className="font-bold">ALL</span> answers are complete,
          and seek clarification if needed. Answers to{" "}
          <span className="font-bold">identification</span> questions must be in{" "}
          <span className="font-bold">ALL-CAPS</span>. Your responses are
          confidential and will guide your specialization choice.
        </p>
      </div>
      {currentItems.map((specializationObj, specializationIndex) => (
        <div key={specializationIndex} className="my-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Specialization: {specializationObj.specialization}
            </h2>
            <div className="space-y-6">
              {specializationObj.questions.map((questionObj, questionIndex) => {
                const globalQuestionIndex =
                  (currentPage - 1) * itemsPerPage + specializationIndex;
                return (
                  <div
                    key={questionIndex}
                    id={`question-${globalQuestionIndex}`}
                    className={`bg-gray-100 p-4 rounded-lg ${
                      submitted &&
                      answers[globalQuestionIndex][questionIndex].trim() === ""
                        ? "bg-red-200"
                        : ""
                    }`}
                  >
                    <p className="font-medium mb-2">{questionObj.question}</p>
                    <div>
                      {questionObj.type === "multiple-choice" ? (
                        questionObj.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center mb-2"
                          >
                            <input
                              id={`answer-${globalQuestionIndex}-${questionIndex}-${optionIndex}`}
                              type="radio"
                              name={`answer-${globalQuestionIndex}-${questionIndex}`}
                              className="mr-2"
                              value={option}
                              checked={
                                answers[globalQuestionIndex][questionIndex] ===
                                option
                              }
                              onChange={(e) =>
                                handleAnswerChange(
                                  globalQuestionIndex,
                                  questionIndex,
                                  e
                                )
                              }
                            />
                            <label
                              htmlFor={`answer-${globalQuestionIndex}-${questionIndex}-${optionIndex}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))
                      ) : (
                        <input
                          type="text"
                          className="border p-2 w-full rounded-md"
                          value={answers[globalQuestionIndex][questionIndex]}
                          onChange={(e) =>
                            handleAnswerChange(
                              globalQuestionIndex,
                              questionIndex,
                              e
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <div className="mt-8 text-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px">
            <li>
              <button
                onClick={() => handlePaginationClick(currentPage - 1)}
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
                  onClick={() => handlePaginationClick(i + 1)}
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
                onClick={() => handlePaginationClick(currentPage + 1)}
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
  );
};

export default Assessment;
