import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const Assessment = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

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
            navigate("/home"); // Go back to the previous page
          });
        }
      }
    };

    checkPreviousAssessment();
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

  // Questions and correct answers for Tourism specialization
  const specializationQuestions = [
    {
      specialization: "Tourism",
      questions: [
        {
          question: "What is the capital city of France?",
          options: ["a) London", "b) Paris", "c) Rome", "d) Berlin"],
          answer: "b) Paris",
          type: "multiple-choice",
        },
        {
          question: "The Great Wall of China can be seen from space.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question: "The Statue of Liberty is located in ________.",
          options: ["a) London", "b) Paris", "c) New York City", "d) Berlin"],
          answer: "c) New York City",
          type: "multiple-choice",
        },
        {
          question: "Which country is known for its pyramids?",
          options: ["a) Mexico", "b) Egypt", "c) Greece", "d) India"],
          answer: "b) Egypt",
          type: "multiple-choice",
        },
        {
          question: "Mount Everest is the tallest mountain in the world.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },

        {
          question: "The Grand Canyon is found in the state of ________.",
          options: ["a) Arizona", "b) Egypt", "c) Greece", "d) India"],
          answer: "a) Arizona",
          type: "multiple-choice",
        },
        {
          question: "What is the official language of Brazil?",
          options: ["a) Spanish", "b) English", "c) Portuguese", "d) French"],
          answer: "c) Portuguese",
          type: "multiple-choice",
        },
        {
          question: "Sydney is the capital city of Australia.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question: "The Eiffel Tower is located in ________.",
          options: ["a) Tokyo", "b) Japan", "c) Paris", "d) Canada"],
          answer: "c) Paris",
          type: "multiple-choice",
        },
        {
          question:
            "Which of the following is a famous beach destination in Thailand?",
          options: ["a) Phuket", "b) Tokyo", "c) Madrid", "d) Nairobi"],
          answer: "a) Phuket",
          type: "multiple-choice",
        },
        {
          question: "The Amazon Rainforest is located in Africa.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question: "What is the main airport in New York City?",
          options: [
            "a) Heathrow Airport",
            "b) John F. Kennedy International Airport",
            "c) Charles de Gaulle Airport",
            "d) LAX",
          ],
          answer: "b) John F. Kennedy International Airport",
          type: "multiple-choice",
        },
        {
          question: "The Leaning Tower of Pisa is located in Spain.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question: "The Colosseum is located in ________.",
          options: ["a) Taiwan", "b) Korea", "c) Portugal", "d) Rome"],
          answer: "d) Rome",
          type: "multiple-choice",
        },
        {
          question: "Which continent is home to the Sahara Desert?",
          options: ["a) Asia", "b) North America", "c) Australia", "d) Africa"],
          answer: "d) Africa",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Automotive",
      questions: [
        {
          question: "Which company manufactures the Model S electric car?",
          options: ["a) Ford", "b) Tesla", "c) BMW", "d) Audi"],
          answer: "b) Tesla",
          type: "multiple-choice",
        },
        {
          question: "The Ford Mustang is a type of motorcycle.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question:
            "The ________ is the part of the car that transmits power from the engine to the wheels.",
          options: ["a) Engine", "b) Tires", "c) Transmission", "d) Lights"],
          answer: "c) Transmission",
          type: "multiple-choice",
        },
        {
          question: "Which country is home to the car manufacturer Toyota?",
          options: ["a) Germany", "b) USA", "c) Japan", "d) South Korea"],
          answer: "c) Japan",
          type: "multiple-choice",
        },
        {
          question:
            "Diesel engines are more fuel-efficient than gasoline engines.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question: "The Tesla Model 3 is an example of an ________ vehicle.",
          options: ["a) Roadster", "b) Manual", "c) Automatic", "d) Electric"],
          answer: "d) Electric",
          type: "multiple-choice",
        },
        {
          question: "Which of these is a luxury car brand?",
          options: ["a) Honda", "b) Hyundai", "c) Lexus", "d) Fiat"],
          answer: "c) Lexus",
          type: "multiple-choice",
        },
        {
          question:
            "Hybrid cars use both an internal combustion engine and an electric motor.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question:
            "The ________ is the gauge that shows how fast a car is traveling",

          answer: "SPEEDOMETER",
          type: "identification",
        },
        {
          question: "Which of these is a common type of fuel for cars?",
          options: ["a) Kerosene", "b) Water", "c) Diesel", "d) Ethanol"],
          answer: "c) Diesel",
          type: "multiple-choice",
        },
        {
          question:
            "All-wheel drive (AWD) provides power to all four wheels of a vehicle.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question: "What does ABS stand for in automotive terms?",
          options: [
            "a) Automated Braking System",
            "b) Anti-lock Braking System",
            "c) Auto Braking System",
            "d) Anti-slip Braking System",
          ],
          answer: "b) Anti-lock Braking System",
          type: "multiple-choice",
        },
        {
          question:
            "The primary purpose of a car's radiator is to heat the engine.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question: "The ________ is used to start the car's engine.",
          answer: "IGNITION",
          type: "identification",
        },
        {
          question: "Which of these is NOT a type of transmission in cars?",
          options: [
            "a) Manual",
            "b) Automatic",
            "c) Semi-automatic",
            "d) Hydraulic",
          ],
          answer: "d) Hydraulic",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Drafting",
      questions: [
        {
          question: "What tool is commonly used for drawing straight lines?",
          options: [
            "a) Compass",
            "b) Ruler",
            "c) Protractor",
            "d) French curve",
          ],
          answer: "b) Ruler",
          type: "multiple-choice",
        },
        {
          question: "In drafting, CAD stands for Computer-Aided Drawing.",
          options: ["True", "False"],
          answer: "False",
          type: "multiple-choice",
        },
        {
          question:
            "A ________ is a detailed drawing showing the front, side, and top views of an object.",

          answer: "ORTHOGRAPHIC PROJECTION",
          type: "identification",
        },
        {
          question: "Which software is commonly used for CAD drafting?",
          options: ["a) Photoshop", "b) AutoCAD", "c) Excel", "d) Word"],
          answer: "b) AutoCAD",
          type: "multiple-choice",
        },
        {
          question:
            "An eraser shield is used to protect the drawing while erasing",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question:
            "A ________ line in drafting represents an object's edge that is not visible in the current ",

          answer: "HIDDEN",
          type: "identification",
        },
        {
          question: "Which of these is a type of perspective drawing?",
          options: [
            "a) Orthographic",
            "b) Isometric",
            "c) Sectional",
            "d) Elevation",
          ],
          answer: "b) Isometric",
          type: "multiple-choice",
        },
        {
          question: "A protractor is used to measure angles.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question:
            "________ drawings provide a view of the interior construction of an object.",

          answer: "SECTION",
          type: "identification",
        },
        {
          question: "Which type of drawing shows the floor plan of a building?",
          options: ["a) Elevation", "b) Section", "c) Layout", "d) Plan"],
          answer: "d) Plan",
          type: "multiple-choice",
        },
        {
          question:
            "Drafting paper is typically more durable and smooth compared to regular paper.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question: "What is the primary purpose of a compass in drafting?",
          options: [
            "a) To measure angles",
            "b) To draw circles and arcs",
            "c) To measure lengths",
            "d) To draw straight lines",
          ],
          answer: "b) To draw circles and arcs",
          type: "multiple-choice",
        },
        {
          question: "Isometric drawings represent a 3D object on 2D paper.",
          options: ["True", "False"],
          answer: "True",
          type: "multiple-choice",
        },
        {
          question:
            "The ________ scale is used to measure distances in technical drawings.",
          answer: "ENGINEER'S",
          type: "identification",
        },
        {
          question:
            "Which tool helps ensure that lines are drawn at accurate right angles?",
          options: ["a) Ruler", "b) Compass", "c) T-square", "d) Protractor"],
          answer: "c) T-square",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Electrical",
      questions: [
        {
          question:
            "It revolves around maintaining and repairing electronic equipment used in large facilities.",
          options: [
            "a) Road Maintenance",
            "b) Electrical Maintenance",
            "c) Building Maintenance  ",
          ],
          answer: "b) Electrical Maintenance",
          type: "multiple-choice",
        },
        {
          question: "These are all benefits of Electrical Maintenance except:",
          options: [
            "a) Save lives",
            "b) Protect Equipments",
            "c) Generates Electricity",
          ],
          answer: "c) Generates Electricity",
          type: "multiple-choice",
        },
        {
          question:
            "A dangerous condition where an individual could make an electrical contact with an energized equipment or a conductor which the person may sustain injury from it.",

          options: [
            "a) Electrical Hazards",
            "b) Road Hazards",
            "c) Electrical Maintenance",
          ],
          answer: "a) Electrical Hazards",
          type: "multiple-choice",
        },
        {
          question:
            "The process of examining of equipments to ensure that they reach an official standard.",
          options: ["a) Inspecting", "b) Testing", "c) Analyzing"],
          answer: "a) Inspecting",
          type: "multiple-choice",
        },
        {
          question:
            "The process of taking measures to check the quality, performance, or reliability of the equipment.",
          options: ["a) Inspecting", "b) Testing", "c) Analyzing"],
          answer: "b) Testing",
          type: "multiple-choice",
        },
        {
          question:
            "The process of examining methodically and in detail the constitution or structure of the equipment typically for purposes of explanation and interpretation.",

          options: ["a) Testing", "b) Analyzing", "c) Sevicing"],
          answer: "b) Analyzing",
          type: "multiple-choice",
        },
        {
          question: "These are examples of safety awareness signs except for",
          options: [
            "a) Safety First Work Safely Sign",
            "b) Eye Protection Required Sign",
            "c) Electrical Hazard Authorized Only Sign",
          ],
          answer: "c) Electrical Hazard Authorized Only Sign",
          type: "multiple-choice",
        },
        {
          question: "OSHA stands for",
          options: [
            "a) Occupational Safety and Health Administration",
            "b) Organization of Safety and Health Administration",
            "c) Occupational Safety or Health Administration",
          ],
          answer: "a) Occupational Safety and Health Administration",
          type: "multiple-choice",
        },
        {
          question:
            "These are fundamentals of electrical maintenance except for",

          options: ["a) Keep It Tight", "b) Keep it right", "c) Keep It Dry"],
          answer: "b) Keep it right",
          type: "multiple-choice",
        },
        {
          question:
            "Prohibits Operation of Equipment, Increases AF Hazard, Increases Contact Resistance",
          options: [
            "a) Free from rusting",
            "b) Shock resistance",
            "c) Friction free",
          ],
          answer: "c) Friction free",
          type: "multiple-choice",
        },
        {
          question: "Electric Shock occurs when a person becomes part of the?",
          options: ["a) Circuit", "b) Path", "c) Team"],
          answer: "a) Circuit",
          type: "multiple-choice",
        },
        {
          question:
            "Before working on a circuit, you must _________ the power supply.",
          options: ["a) Switch on", "b) Switch off", "c) Hold"],
          answer: "b) Switch off",
          type: "multiple-choice",
        },
        {
          question: "Electricity is made at a power plant by a huge?",
          options: ["a) Motor", "b) Generator", "c) Wire"],
          answer: "b) Generator",
          type: "multiple-choice",
        },
        {
          question: "All exposed metal in the electrical circuit should be ",
          options: ["a) Earthed", "b) Connected", "c) Kept away"],
          answer: "a) Earthed",
          type: "multiple-choice",
        },
        {
          question:
            "The accepted lethal level of shock current passing through a person is about?",
          options: ["a) 10mA", "b) 20mA", "c) 30mA"],
          answer: "c) 30mA",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Electronics",
      questions: [
        {
          question: "Which of the following is not an electronic device?",
          options: ["a) A mobile", "b) A computer", "c) A magnifying glass"],
          answer: "c) A magnifying glass",
          type: "multiple-choice",
        },
        {
          question:
            "Which of the following is not a physical component of an electronic circuit?",
          options: ["a) Capacitor", "b) Inductor", "c) Temperature"],
          answer: "c) Temperature",
          type: "multiple-choice",
        },
        {
          question:
            "Which of the following is not a property of semiconductors used in electronic devices?",

          options: [
            "a) They excite electrons",
            "b) They don’t emit light",
            "c) They have high thermal conductivity",
          ],
          answer: "b) They don’t emit light",
          type: "multiple-choice",
        },
        {
          question:
            "Which of the following is not correct about semiconductors in electronic devices?",
          options: [
            "a) Electrons are present below Fermi level in a semiconductor",
            "b) Degenerated semiconductors behave like a conductor",
            "c) Fermi level is independent of temperature and doping",
          ],
          answer: "c) Fermi level is independent of temperature and doping",
          type: "multiple-choice",
        },
        {
          question:
            "What type of semiconductor is used in LED electronic circuits?",
          options: [
            "a) Intrinsic semiconductor",
            "b) Compound semiconductor",
            "c) Degenerated semiconductor",
          ],
          answer: "b) Compound semiconductor",
          type: "multiple-choice",
        },
        {
          question:
            "Which of the following semiconductor is mostly used to construct electronic circuits?",

          options: ["a) Silicon", "b) Germanium", "c) Selenium"],
          answer: "a) Silicon",
          type: "multiple-choice",
        },
        {
          question: "Which type of semiconductor is used in Tunnel Diode?",
          options: [
            "a) Compound semiconductor",
            "b) Elemental semiconductor",
            "c) Degenerated semiconductor",
          ],
          answer: "c) Degenerated semiconductor",
          type: "multiple-choice",
        },
        {
          question:
            "What is the conductivity of an extrinsic type semiconductor electronic device at 0K?",
          options: ["a) Maximum", "b) Zero", "c) Can't be determined"],
          answer: "b) Zero",
          type: "multiple-choice",
        },
        {
          question:
            "What is the conductivity of an extrinsic type semiconductor electronic device at 300K?",

          options: ["a) Maximum", "b) Zero", "c) Minimum"],
          answer: "a) Maximum",
          type: "multiple-choice",
        },
        {
          question:
            "Which of the following effects is responsible for violating the mass action law in degenerative type semiconductor electronic devices?",
          options: [
            "a) Thermal effect",
            "b) Bandgap narrowing effect",
            "c) Lattice vibration effect",
          ],
          answer: "b) Bandgap narrowing effect",
          type: "multiple-choice",
        },
        {
          question: "Charge in motion is called...?",
          options: ["a) Resistance", "b) Flux", "c) Current"],
          answer: "c) Current",
          type: "multiple-choice",
        },
        {
          question: "The unit of potential difference is the?",
          options: ["a) Watt", "b) Volt", "c) Ampere"],
          answer: "b) Volt",
          type: "multiple-choice",
        },
        {
          question:
            "A material that has extremely high electrical resistance is known as?",
          options: ["a) A resistor", "b) An insulator", "c) A semiconductor "],
          answer: "b) An insulator",
          type: "multiple-choice",
        },
        {
          question:
            "What ranch of physics refers to the flow of electrons through non-metal",
          options: ["a) Mechanics", "b) Electricity", "c) Electronics"],
          answer: "c) Electronics",
          type: "multiple-choice",
        },
        {
          question: "A capacitor stores electrical energy as",
          options: [
            "a) A magnetic field",
            "b) An electric field",
            "c) Voltage",
          ],
          answer: "b) An electric field",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Welding",
      questions: [
        {
          question:
            "Name the defect, in which the weld metal is following on the surface on the base metal without fusing.",
          options: ["a) Crater ", "b) Overlap", "c) Lack of fusion"],
          answer: "b) Overlap",
          type: "multiple-choice",
        },
        {
          question:
            "Which type of filler rod is to be selected to avoid weld decay in stainless steel welding?",
          options: [
            "a) Columbium based ",
            "b) Copper coated mild steel",
            "c) Phosphor bronze ",
          ],
          answer: "a) Columbium based",
          type: "multiple-choice",
        },
        {
          question:
            "The distance between the root and toe of a fillet weld is called",

          options: ["a) Root gap ", "b) Leg length", "c) Reinforcement "],
          answer: "b) Leg length",
          type: "multiple-choice",
        },
        {
          question:
            "Which type of arc length is used for welding in horizontal position ?",
          options: ["a) Short arc ", "b) Long arc ", "c) Correct arc "],
          answer: "a) Short arc",
          type: "multiple-choice",
        },
        {
          question:
            "The type of edge preparation done for gas welding a 4 mm thick copper butt joint is?",
          options: ["a) Single beval ", "b) Single V", "c) Double V"],
          answer: "b) Single V",
          type: "multiple-choice",
        },
        {
          question: "Lack of penetration in a butt welded joint is due to",

          options: [
            "a) too low welding speed",
            "b) short arc length",
            "c) low current",
          ],
          answer: "c) low current",
          type: "multiple-choice",
        },
        {
          question:
            "If the travel speed of electrode is high, which type of weld defect you will get on T fillet joint ?",
          options: [
            "a) Over lap",
            "b) Slag inclusion",
            "c) Lack of root penetration",
          ],
          answer: "c) Lack of root penetration",
          type: "multiple-choice",
        },
        {
          question: "Which internal defect is occurs to use of wet electrodes ",
          options: ["a) Undercut ", "b) Porosity", "c) Crater"],
          answer: "b) Porosity",
          type: "multiple-choice",
        },
        {
          question: "A welding transformer may be",

          options: [
            "a) Air cooled or water cooled",
            "b) Water cooled or oil cooled",
            "c) Air cooled or oil cooled",
          ],
          answer: "c) Air cooled or oil cooled",
          type: "multiple-choice",
        },
        {
          question:
            "A keyhole is to be maintained throughout the welding of the first run in a butt joint to ensure",
          options: [
            "a) proper bead width",
            "b) good reinforcement ",
            "c) proper root penetration",
          ],
          answer: "c) proper root penetration",
          type: "multiple-choice",
        },
        {
          question:
            "Which weld procedure is safe to perform in wet conditions? ",
          options: ["a) Arc welding", "b) MIG welding", "c) Oxy welding"],
          answer: "c) Oxy welding",
          type: "multiple-choice",
        },
        {
          question:
            "What is the minimum recommended filter shade on a welding helmet to protect your eyes?",
          options: ["a) Clear lens", "b) Shade 5", "c) Shade 10"],
          answer: "c) Shade 10",
          type: "multiple-choice",
        },
        {
          question:
            "What type of respiratory protection is the minimum required when welding? ",
          options: ["a) P2 Respiratory", "b) Dusk mask", "c) Hazmat suit  "],
          answer: "a) P2 Respiratory",
          type: "multiple-choice",
        },
        {
          question:
            "The voltage needed in resistance welding does not depend upon?",
          options: [
            "a) Composition",
            "b) Thickness of weld",
            "c) Length of weld",
          ],
          answer: "c) Length of weld",
          type: "multiple-choice",
        },
        {
          question:
            "The voltage used in resistance welding is generally kept between?",
          options: ["a) 4-12 volts", "b) 12-20 volts", "c) 20-30 volts"],
          answer: "a) 4-12 volts",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Garments",
      questions: [
        {
          question:
            "It needs to provide adequate room to move, while still maintaining its shape, or form.  The selected fabric needs to be a suitable weight and appropriate for the garment.  ",
          options: ["a) Functional Design", "b) Structural Design"],
          answer: "a) Functional Design",
          type: "multiple-choice",
        },
        {
          question:
            "The structure of a garment is everything that holds the garment together.  The fabric, the seams, shaping and everything that goes on between the outer fabric and the inside.  It incorporates a number of different elements depending on the desired look that you want to achieve. ",
          options: ["a) Functional Design", "b) Structural Design"],
          answer: "b) Structural Design",
          type: "multiple-choice",
        },
        {
          question:
            "Refers to the decorative surface finish, but it is often what catches your eye and draws you to a garment. Details such as buttons, bows, trim, embroidery, prints, pattern and color.  These embellishments can be paired to enhance a design or to subvert it.  Their purpose may be completely decorative, but is always carefully considered.",

          options: ["a) Structural Design", "b) Decorative Design"],
          answer: "b) Decorative Design",
          type: "multiple-choice",
        },
        {
          question:
            "These stitches are also known as tacking or basting stitches. Usually this stitch is horizontal and it is worked from the right to the left side with a knot.",
          options: ["a) Temporary Stitches", "b) Permanent Stitches"],
          answer: "a) Temporary Stitches",
          type: "multiple-choice",
        },
        {
          question:
            "The stitches that form a part of the stitched garment are called___________.",
          options: ["a) Temporary Stitches", "b) Permanent Stitches"],
          answer: "b) Permanent Stitches",
          type: "multiple-choice",
        },
        {
          question:
            "It is used to hold the fabric together temporarily, but more securely than in uneven basting.",

          options: ["a) Even Basting", "b) Uneven basting"],
          answer: "a) Even Basting",
          type: "multiple-choice",
        },
        {
          question:
            "This is used to hold two pieces of fabric together when more than one row of tacking is required.",
          options: ["a) Slip Basting", "b) Diagonal Basting "],
          answer: "b) Diagonal Basting",
          type: "multiple-choice",
        },
        {
          question:
            "This is used to mark or to hold fabrics together, only where there is no strain on the stitches.",
          options: ["a) Even Basting", "b) Uneven basting"],
          answer: "b) Uneven basting",
          type: "multiple-choice",
        },
        {
          question:
            "Also called invisible hand basting, it is used when working from the right side of the fabric, and to mark fitting alterations, or on occasions where patterns have to be joined accurately",

          options: ["a) Slip Basting", "b) Diagonal Basting "],
          answer: "a) Slip Basting",
          type: "multiple-choice",
        },
        {
          question:
            "This is the simplest form of hand stitch which is used mainly for gathering and shirring fabrics. ",
          options: ["a) Running Stitches", "b) Back Stitches"],
          answer: "a) Running Stitches",
          type: "multiple-choice",
        },
        {
          question:
            "It is used for hems on medium weight or lightweight fabrics.",
          options: ["a) Hem Stitch", "b) Run and back or combination stitch"],
          answer: "a) Hem Stitch",
          type: "multiple-choice",
        },
        {
          question:
            "This stitch is quite similar to the back stitch, but with a longer stitch at the back side of the fabric.",
          options: ["a) Hem Stitch", "b) Half Back Stitch"],
          answer: "b) Half Back Stitch",
          type: "multiple-choice",
        },
        {
          question:
            "It is used to finish seam edges on fabrics which fray easily.",
          options: ["a) Oversewing", "b) Half Back Stitch"],
          answer: "a) Oversewing",
          type: "multiple-choice",
        },
        {
          question:
            "This stitch is worked on the inside fold of the hem so that the stitches are almost invisible; thus, the name ‘blind’.",
          options: ["a) Oversewing", "b) Blind hemming stitch"],
          answer: "b) Blind hemming stitch",
          type: "multiple-choice",
        },
        {
          question: "These stitches are also known as embroidery stitches.",
          options: ["a) Decorative Stiches", "b) Constructive Stitches"],
          answer: "a) Decorative Stiches",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Cosmetology",
      questions: [
        {
          question:
            "Is any preparation intended to be applied directly to a part of the human body especially the skin, hair, and nails, thereby promoting attractiveness, or altering one’s appearance.",
          options: ["a) Cosmetics/Cosmetic", "b) Cosmetology"],
          answer: "a) Cosmetics/Cosmetic",
          type: "multiple-choice",
        },
        {
          question:
            "It is the study or art of cosmetics and their application.",
          options: ["a) Cosmetics/Cosmetic", "b) Cosmetology"],
          answer: "b) Cosmetology",
          type: "multiple-choice",
        },
        {
          question:
            "He/she is the one who manufactures, sells, or applies cosmetics.",

          options: ["a) Cosmetician", "b) Cosmetology"],
          answer: "a) Cosmetician",
          type: "multiple-choice",
        },
        {
          question:
            "Skin care products are specially designed for different skin types and should be chosen accordingly so that you compensate as much as possible for your skin’s deficiencies.",
          options: ["a) Beauty Products", "b) Healthy Skin"],
          answer: "a) Beauty Products",
          type: "multiple-choice",
        },
        {
          question:
            "The purpose of washing your face is to take off surface grime, excess sebum, and accumulated dirt, without upsetting the natural balance of your skin.",
          options: ["a) Beauty Products", "b)  Washing"],
          answer: "b) Washing",
          type: "multiple-choice",
        },
        {
          question:
            "When working with chemically relaxed hair, you should avoid using:",

          options: ["a) Hot Irons", "b) Caution"],
          answer: "a) Hot Irons",
          type: "multiple-choice",
        },
        {
          question:
            "To avoid scalp irritation, before the application of hydroxide relaxer never:",
          options: ["a) Shampoo the hair", "b) Closet to the scalp"],
          answer: "a) Shampoo the hair",
          type: "multiple-choice",
        },
        {
          question:
            "Cream used to protect the skin and scalp during a hair-relaxing process is:",
          options: ["a) Base Cream", "b) Base relaxers"],
          answer: "a) Base Cream",
          type: "multiple-choice",
        },
        {
          question:
            "Permanent wave solution should be rinsed from the hair for a minimum:",

          options: ["a) 10 minutes", "b) 5 minutes"],
          answer: "b) 5 minutes",
          type: "multiple-choice",
        },
        {
          question:
            "Performing texture services involves powerful chemicals that must be handled with:",
          options: ["a) Hot Irons", "b) Caution"],
          answer: "b) Caution",
          type: "multiple-choice",
        },
        {
          question:
            "The term used to describe removing excess water before the application of a neutralizer is:",
          options: ["a) Rinding ", "b) Rinsing"],
          answer: "a) Rinding",
          type: "multiple-choice",
        },
        {
          question:
            "When checking for test curl development, the teest curl should reflect:",
          options: ["a) Firm S Formation", "b) Smaller and Tighter"],
          answer: "a) Firm S Formation",
          type: "multiple-choice",
        },
        {
          question:
            "When performing test curls, the rod should be unwound approximately:",
          options: ["a) 11/2 turns ", "b) 1 21/24 turns"],
          answer: "a) 11/2 turns",
          type: "multiple-choice",
        },
        {
          question:
            "Incorrect placement of the rubber band of perm rods will cause band marks or:",
          options: ["a) Breakage ", "b) Heat"],
          answer: "a) Breakage",
          type: "multiple-choice",
        },
        {
          question:
            "Conditioners with an acidic pH that condition and normalize hair prior to shampooing are:",
          options: ["a) Normalizing lotions", "b) Chemical Hair Relaxing"],
          answer: "a) Normalizing lotions",
          type: "multiple-choice",
        },
      ],
    },

    {
      specialization: "Food and Beverages",
      questions: [
        {
          question:
            "Work in hotels and deliver orders to customers. It is a personalized service offered by hotels that gives the guests a distinctive and unique chance to order and enjoy their food while staying inside their room or where convenience and privacy are guaranteed.",
          options: ["a) Room service Staff", "b) Room service employee"],
          answer: "a) Room service Staff",
          type: "multiple-choice",
        },
        {
          question:
            "A range of food items offered for service usually written and including prices.",
          options: ["a) Package", "b) Menu"],
          answer: "b) Menu",
          type: "multiple-choice",
        },
        {
          question: "Served without charge.",

          options: ["a) Supplies", "b) Complimentary items"],
          answer: "b) Complimentary items",
          type: "multiple-choice",
        },
        {
          question:
            "Items supplied by the venue for the guest’s consumption such as pens, notepads, matches, etc.",
          options: ["a) Amenities", "b) Supplies"],
          answer: "a) Amenities",
          type: "multiple-choice",
        },
        {
          question:
            "Items supplied by the venue guest use while occupying the room.",
          options: ["a) Amenities", "b)  Supplies"],
          answer: "b)  Supplies",
          type: "multiple-choice",
        },
        {
          question: "Room rate plus several services at one price",

          options: ["a) Package", "b) Suites"],
          answer: "a) Package",
          type: "multiple-choice",
        },
        {
          question:
            "Ares in a hotel or resort where the general public has access, such as bars, and restaurants.",
          options: ["a) Public areas", "b) Mini bar"],
          answer: "a) Public areas",
          type: "multiple-choice",
        },
        {
          question: "Handbook or folder hard copy or electronic.",
          options: ["a) Compendium", "b) Concierge"],
          answer: "a) Compendium",
          type: "multiple-choice",
        },
        {
          question:
            "System relying on the guest to record consumption of chargeable items in their room",

          options: ["a) Honour System", "b) Housekeeping"],
          answer: "a) Honour System",
          type: "multiple-choice",
        },
        {
          question:
            "Department that is responsible for the cleanliness of a guest room during their day",
          options: ["a) Porter", "b) Housekeeping"],
          answer: "b) Housekeeping",
          type: "multiple-choice",
        },
        {
          question:
            "Responsible for luggage management, valet parking and guest services such as visitor information.",
          options: ["a) Porter", "b) Housekeeping"],
          answer: "b) Housekeeping",
          type: "multiple-choice",
        },
        {
          question: "Guests who are very important persons.",
          options: ["a) VIP's", "b) SPATT/Special attention Guests"],
          answer: "a) VIP's",
          type: "multiple-choice",
        },
        {
          question:
            "Items such as sauces, mustards, and other seasoning or side dishes that are served as an accompaniment to a dish.",
          options: ["a) Hotbox", "b) Condiments"],
          answer: "b) Condiments",
          type: "multiple-choice",
        },

        {
          question:
            "Small pre-heated insulated box that fits under the trolley or at the base of multi tray trolley to keep hot food hot.",
          options: ["a) Hotbox", "b) Condiments"],
          answer: "a) Hotbox",
          type: "multiple-choice",
        },
        {
          question:
            "Record of the guest's personal details including food preferences and allergies.",
          options: ["a) Guest folio or Account ", "b) Guest Profile"],
          answer: "b) Guest Profile",
          type: "multiple-choice",
        },
      ],
    },
  ];

  // Function to handle user input for each question
  const handleAnswerChange = (specializationIndex, questionIndex, event) => {
    const newAnswers = [...answers];
    newAnswers[specializationIndex][questionIndex] = event.target.value;
    setAnswers(newAnswers);
  };

  // Function to calculate scores for all specializations
  const calculateScores = () => {
    const scores = specializationQuestions.map(
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

      // Update existing user data with scores
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Assessment</h1>
      {specializationQuestions.map((specializationObj, specializationIndex) => (
        <div key={specializationIndex} className="mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Specialization: {specializationObj.specialization}
            </h2>
            <div className="space-y-6">
              {specializationObj.questions.map((questionObj, questionIndex) => (
                <div
                  key={questionIndex}
                  id={`question-${questionIndex}`}
                  className={`bg-gray-100 p-4 rounded-lg ${
                    submitted &&
                    answers[specializationIndex][questionIndex].trim() === ""
                      ? "bg-red-200" // Apply red background if question is unanswered and form is submitted
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
                            id={`answer-${specializationIndex}-${questionIndex}-${optionIndex}`}
                            type="radio"
                            name={`answer-${specializationIndex}-${questionIndex}`}
                            className="mr-2"
                            value={option}
                            checked={
                              answers[specializationIndex][questionIndex] ===
                              option
                            }
                            onChange={(e) =>
                              handleAnswerChange(
                                specializationIndex,
                                questionIndex,
                                e
                              )
                            }
                          />
                          <label
                            htmlFor={`answer-${specializationIndex}-${questionIndex}-${optionIndex}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))
                    ) : (
                      <input
                        type="text"
                        className="border p-2 w-full rounded-md"
                        value={answers[specializationIndex][questionIndex]}
                        onChange={(e) =>
                          handleAnswerChange(
                            specializationIndex,
                            questionIndex,
                            e
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="mt-8 text-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Assessment;
