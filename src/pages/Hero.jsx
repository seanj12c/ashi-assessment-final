import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebaseConfig";
import garments from "../assets/garments.jpg";
import automotive from "../assets/automotive.jpg";
import tourism from "../assets/t2.jpg";
import css from "../assets/s2.jpg";

const Hero = () => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const getCurrentUserId = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        return currentUser.uid;
      } else {
        // Handle the case when there's no authenticated user
        return null;
      }
    };

    const fetchUserData = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) return; // If there's no authenticated user, exit early

        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("userId", "==", userId));
        const usersSnapshot = await getDocs(q);

        usersSnapshot.forEach((doc) => {
          // Assuming you have a field 'firstName' in your user document
          setFirstName(doc.data().firstName);
        });
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <div class="grid grid-cols-2 gap-8 w-full">
            <div class="group relative overflow-hidden bg-gray-100 rounded-lg hover:shadow-xl transition duration-300">
              <img
                src={garments}
                alt="Garments"
                class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white font-bold opacity-0 hover:opacity-100 transition duration-300">
                Garments
              </div>
            </div>
            <div class="group relative overflow-hidden bg-gray-100 rounded-lg hover:shadow-xl transition duration-300">
              <img
                src={automotive}
                alt="Automotive"
                class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white font-bold opacity-0 hover:opacity-100 transition duration-300">
                Automotive
              </div>
            </div>
            <div class="group relative overflow-hidden bg-gray-100 rounded-lg hover:shadow-xl transition duration-300">
              <img
                src={tourism}
                alt="Tourism"
                class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white font-bold opacity-0 hover:opacity-100 transition duration-300">
                Tourism
              </div>
            </div>
            <div class="group relative overflow-hidden bg-gray-100 rounded-lg hover:shadow-xl transition duration-300">
              <img
                src={css}
                alt="Computer System Servicing"
                class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white font-bold opacity-0 hover:opacity-100 transition duration-300">
                Computer System Servicing
              </div>
            </div>
          </div>
          <div>
            <h1 class="text-lg text-center lg:text-start lg:text-5xl font-bold">
              WELCOME <span id="user-name">{firstName}</span>,
            </h1>
            <p class="lg:py-6 py-2 text-justify lg:text-start">
              Amaya School of Home Industries is a public technical-vocational
              high school which implements education programs in accordance with
              its curriculum Strengthened Technical - Vocational Education
              Program – Competency Based Curriculum (STVEP – CBC)
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link to="/assessment" class="btn text-white btn-secondary">
                Pre-Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
