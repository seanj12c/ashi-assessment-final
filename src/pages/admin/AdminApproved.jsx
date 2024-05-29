import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebaseConfig";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import logo from "../../assets/ASHI_LOGO.png";

import { AiFillCheckCircle, AiOutlineLoading } from "react-icons/ai";
import AdminNavbar from "./AdminNavbar";

const AdminApproved = () => {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "arts"),
      async (snapshot) => {
        const artsData = [];
        for (const docSnap of snapshot.docs) {
          const artData = docSnap.data();
          try {
            const userDoc = await getDoc(
              doc(firestore, "users", artData.userId)
            );
            const userData = userDoc.data();
            if (artData.isApproved) {
              // Only include arts that are approved
              artsData.push({
                id: docSnap.id,
                ...artData,
                user: userData,
              });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            artsData.push({
              id: docSnap.id,
              ...artData,
              user: null,
            });
          }
        }
        setArts(artsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
            // Redirect or handle after logout actions
            navigate("/");
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 hidden md:flex flex-col bg-primary text-secondary flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center pt-24 justify-center h-20">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        {/* Navigation buttons */}
        <nav className="flex flex-col pt-24 px-1 justify-between flex-1">
          <ul className="space-y-2">
            <li>
              <Link to="/admin/dashboard" className="btn w-full">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/approved" className="btn w-full">
                Approved
              </Link>
            </li>

            <li>
              <button
                className="btn text-white btn-error w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
          {/* Text at the bottom */}
          <div className="text-center text-xs py-2">
            Art Gallery Admin Panel
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Approved Arts</h1>
          {loading ? (
            <p className="w-full flex justify-center items-center">
              <p className="w-full flex justify-center items-center">
                <AiOutlineLoading size={60} className="animate-spin" />
              </p>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
              {arts.length === 0 ? (
                <p className="text-center text-gray-500">
                  No approved arts available
                </p>
              ) : (
                arts.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white flex flex-col justify-between rounded-lg shadow-lg p-4 mb-2"
                  >
                    <div className="flex items-center my-2">
                      {art.user && art.user.profilePhotoUrl && (
                        <img
                          src={art.user.profilePhotoUrl}
                          alt={`${art.user.firstName} ${art.user.lastName}`}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      )}
                      <p className="text-gray-600">
                        {art.user &&
                          `${art.user.firstName} ${art.user.lastName}`}
                      </p>
                    </div>
                    <h2 className="text-xl font-semibold">{art.title}</h2>
                    <p className="text-gray-600">{art.description}</p>
                    <div className="flex gap-1 items-center">
                      <AiFillCheckCircle size={20} className="text-primary" />
                      <h1>Approved</h1>
                    </div>
                    <div className="flex justify-center mt-4">
                      {/* Display the first photo from art */}
                      {art.photos && art.photos.length > 0 && (
                        <img
                          src={art.photos[0]}
                          alt={`First Arts`}
                          className="w-32 h-32 object-cover rounded cursor-pointer"
                          onClick={() =>
                            document.getElementById("photos").showModal(0)
                          }
                        />
                      )}
                    </div>
                    <div className="flex justify-center pt-2 gap-2">
                      <button
                        className="btn btn-xs"
                        onClick={() =>
                          document
                            .getElementById(`photos-${art.id}`)
                            .showModal()
                        }
                      >
                        View all Photos
                      </button>
                    </div>
                    <dialog
                      id={`photos-${art.id}`}
                      className="modal modal-bottom sm:modal-middle"
                    >
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">All Photos</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {/* Display all photos */}
                          {art.photos &&
                            art.photos.map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Arts ${index + 1}`}
                                className="w-32 h-32 object-cover rounded cursor-pointer"
                                onClick={() =>
                                  document
                                    .getElementById("photos")
                                    .showModal(index)
                                }
                              />
                            ))}
                        </div>
                        <div className="modal-action">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApproved;
