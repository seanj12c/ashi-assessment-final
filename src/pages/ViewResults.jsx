import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebaseConfig";
import { increment, doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import questionmark from "../assets/questionmark.png";

const ViewResults = () => {
  const [topScores, setTopScores] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const [specialization, setSpecialization] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allTopSlotsFull, setAllTopSlotsFull] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(firestore, "users", userId);
      const userData = await getDoc(userRef);

      if (userData.exists()) {
        const data = userData.data();
        setUserData(data);

        const userScores = data.scores || {};
        const totalQuestions = 15;
        const userSpecialization = data.specialization || null;

        setSpecialization(userSpecialization);

        const scoresArray = Object.entries(userScores).map(
          ([specialization, score]) => ({
            specialization,
            percentage: ((score / totalQuestions) * 100).toFixed(0),
          })
        );

        const sortedScores = scoresArray
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 3); // Get top 3 scores

        setTopScores(sortedScores);
        setAllScores(scoresArray);

        // Check slot availability
        const slotDocRef = doc(firestore, "slot", "Oq0uCfcbevIs4VlFLB4h");
        const slotDoc = await getDoc(slotDocRef);
        const slotData = slotDoc.data();

        const allSlotsFull = sortedScores.every((score) => {
          const scoreSpecializationCamelCase =
            score.specialization.toLowerCase();
          const slotCount = slotData[scoreSpecializationCamelCase] || 0;
          return slotCount === 0;
        });

        setAllTopSlotsFull(allSlotsFull);
      }
      setIsLoading(false);
    };

    fetchScores();
  }, []);

  const handleEnlistSpecialization = async () => {
    const slotDocRef = doc(firestore, "slot", "Oq0uCfcbevIs4VlFLB4h");
    const slotDoc = await getDoc(slotDocRef);
    const slotData = slotDoc.data();
    // eslint-disable-next-line
    const inputOptions = topScores.reduce((options, score) => {
      const scoreSpecializationCamelCase = score.specialization.toLowerCase();
      const slotCount = slotData[scoreSpecializationCamelCase] || 0;

      options[score.specialization] = {
        specialization: score.specialization,
        disabled: slotCount === 0,
        slotCount: slotCount,
      };
      return options;
    }, {});

    const { value: selectedSpecialization } = await Swal.fire({
      title: "Enlist a Specialization",
      html: `
        <div class="space-y-4">
          ${topScores
            .map((score) => {
              const scoreSpecializationCamelCase =
                score.specialization.toLowerCase();
              const slotCount = slotData[scoreSpecializationCamelCase] || 0;
              const isDisabled = slotCount === 0;

              return `
              <label class="flex items-center space-x-2">
                <input type="radio" name="specialization" value="${
                  score.specialization
                }" class="form-radio h-5 w-5 text-secondary" ${
                isDisabled ? "disabled" : ""
              }>
                <span class="text-sm md:text-base ${
                  isDisabled ? "text-gray-400" : ""
                }">${score.specialization} ${
                isDisabled ? "(No slot available)" : ""
              }</span>
              </label>
            `;
            })
            .join("")}
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const selected = document.querySelector(
          'input[name="specialization"]:checked'
        );
        if (!selected) {
          Swal.showValidationMessage("You need to choose something!");
          return null;
        }
        return selected.value;
      },
      showCancelButton: true,
      confirmButtonColor: "#0D3A67",
      confirmButtonText: "Enlist",
      cancelButtonText: "Cancel",
    });

    if (selectedSpecialization) {
      const confirmResult = await Swal.fire({
        title: `Do you really want to enlist ${selectedSpecialization}?`,
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0D3A67",
        confirmButtonText: "Yes, enlist it!",
        cancelButtonText: "No, cancel",
      });

      if (confirmResult.isConfirmed) {
        const userId = auth.currentUser.uid;
        const userRef = doc(firestore, "users", userId);

        // Convert selected specialization to camelCase

        // Get the current date
        const currentDate = new Date();
        const formattedDate = `${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}/${currentDate.getFullYear().toString().slice(-2)}`;

        // Update user specialization and enlist date
        await updateDoc(userRef, {
          specialization: selectedSpecialization,
          isDone: true,
          enlistDate: formattedDate,
        });

        const selectedSpecializationCamelCase =
          selectedSpecialization.toLowerCase();

        const slotDocRef = doc(firestore, "slot", "Oq0uCfcbevIs4VlFLB4h"); // Replace "singleDocumentId" with the actual ID of the document
        await updateDoc(slotDocRef, {
          [selectedSpecializationCamelCase]: increment(-1),
        });

        setSpecialization(selectedSpecialization);

        Swal.fire({
          title: `You have enlisted ${selectedSpecialization}`,
          icon: "success",
          confirmButtonColor: "#0D3A67",
          confirmButtonText: "Confirm",
        });
      }
    }
  };

  const handleDownloadForm = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Amaya School of Home Industries",
              heading: "Title",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Student Information",
                  bold: true,
                  size: 28,
                  underline: true,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Name")],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(
                          `${userData.lastName}, ${userData.firstName}, ${
                            userData.middleName || "N/A"
                          }`
                        ),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Gender")],
                    }),
                    new TableCell({
                      children: [new Paragraph(userData.gender)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("LRN")],
                    }),
                    new TableCell({
                      children: [new Paragraph(userData.lrn)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Email")],
                    }),
                    new TableCell({
                      children: [new Paragraph(userData.email)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Contact")],
                    }),
                    new TableCell({
                      children: [new Paragraph(userData.contact)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Address")],
                    }),
                    new TableCell({
                      children: [new Paragraph(userData.address)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Enlist Date")],
                    }),
                    new TableCell({
                      children: [new Paragraph(userData.enlistDate)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Specialization")],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(userData.specialization || "N/A"),
                      ],
                    }),
                  ],
                }),
              ],
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Scores",
                  bold: true,
                  size: 24,
                  underline: true,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),
            new Table({
              rows: [
                ...allScores.map(
                  (score) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(score.specialization)],
                        }),
                        new TableCell({
                          children: [new Paragraph(`${score.percentage}%`)],
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
      saveAs(
        new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
        "StudentForm.docx"
      );
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AiOutlineLoading size={60} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">View Results</h1>
      {userData.isDone ? (
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl text-center font-semibold mb-2">
                Your Top Scores
              </h2>
              <div className="space-y-2 mb-4">
                {topScores.map((score, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1/3 text-xs md:text-base">
                      {score.specialization}
                    </span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-secondary h-4 rounded-full"
                        style={{ width: `${score.percentage}%` }}
                      ></div>
                      <span className="absolute right-0 top-0 text-sm text-black px-2">
                        {score.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-t-2 border-gray-300 my-4" />

              <h2 className="text-xl text-center font-semibold mb-2">
                All Scores
              </h2>
              <div className="space-y-2">
                {allScores.map((score, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1/3 text-xs md:text-base">
                      {score.specialization}
                    </span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-secondary h-4 rounded-full"
                        style={{ width: `${score.percentage}%` }}
                      ></div>
                      <span className="absolute right-0 top-0 text-sm text-black px-2">
                        {score.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              {allTopSlotsFull && (
                <h1 className="italic text-error text-center text-xs">
                  Your top 3 scores was full, download the form and present it
                  to the school.
                </h1>
              )}
              <div className=" flex flex-col gap-2 justify-center md:flex-row text-center">
                <button
                  onClick={handleEnlistSpecialization}
                  className="btn btn-secondary text-white"
                  disabled={specialization !== null}
                >
                  {specialization
                    ? `Specialization Enlisted: ${specialization}`
                    : "Enlist a Specialization"}
                </button>
                {!specialization || allTopSlotsFull || (
                  <button
                    onClick={handleDownloadForm}
                    className="btn btn-primary text-white"
                  >
                    Download Form
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            You haven't taken any assessment yet.
          </p>

          <img className="w-52 mx-auto md:w-72" src={questionmark} alt="" />
          <p className="text-lg mb-4">
            Please proceed to the pre-assessment to view your results.
          </p>
          <Link to="/assessment">
            <button onClick={() => {}} className="btn btn-primary text-white">
              Pre-Assessment Now!
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ViewResults;
