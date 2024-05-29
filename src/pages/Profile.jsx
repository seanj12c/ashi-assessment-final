import React, { useState, useEffect } from "react";
import { firestore, storage, auth } from "../firebaseConfig"; // Import Firestore and Storage
import { collection, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contact: "",
    gender: "",
    address: "",
    lrn: "",
  });

  const getCurrentUserId = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return currentUser.uid;
    } else {
      // Handle the case when there's no authenticated user
      return null;
    }
  };

  useEffect(() => {
    // Fetch user data
    const unsubscribeUsers = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const userDataArray = [];
        snapshot.forEach((doc) => {
          userDataArray.push({ id: doc.id, ...doc.data() });
        });
        // Set user data state
        setUserData(userDataArray);

        // Get current user's UID
        const currentUserUID = auth.currentUser.uid;

        // Find current user's data by UID
        const currentUserData = userDataArray.find(
          (user) => user.id === currentUserUID
        );

        // If current user's data is found, set form data
        if (currentUserData) {
          setFormData({
            firstName: currentUserData.firstName || "",
            middleName: currentUserData.middleName || "",
            lastName: currentUserData.lastName || "",
            contact: currentUserData.contact || "",
            gender: currentUserData.gender || "",
            address: currentUserData.address || "",
            lrn: currentUserData.lrn || "",
          });
        }
      }
    );

    // Cleanup function
    return () => unsubscribeUsers();
  }, [setFormData]); // Include setFormData in the dependency array if it can change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, formData);
      Swal.fire({
        icon: "success",
        title: "Details Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      // Close the modal after displaying the success message
      document.getElementById("my_modal_" + userId).close();
    } catch (error) {
      console.error("Error updating user details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user details. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleImageUpload = async (event, userId) => {
    try {
      const file = event.target.files[0];
      const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);

      // Show loading message
      Swal.fire({
        title: "Uploading Image...",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully. URL:", imageURL);

      // Update the profilePhotoUrl in Firestore
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, { profilePhotoUrl: imageURL });
      console.log("Profile photo URL updated in Firestore.");

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Image Uploaded Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error uploading image:", error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload image. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };
  const openImageInFullScreen = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: "Full Screen Image",
      showCloseButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      customClass: {
        image: "swal2-image-fullscreen",
      },
    });
  };

  return (
    <div className="min-full max-w-2xl mx-auto bg-gray-100 py-5 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          My Profile
        </h1>
        <div className="">
          {userData
            .filter((user) => user.id === getCurrentUserId()) // Filter to find the authenticated user's profile
            .map((user, index) => (
              <div
                key={index}
                className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200"
              >
                <div className="w-full p-5 rounded-full">
                  <div
                    className="h-32 mx-auto w-32 cursor-pointer"
                    onClick={() =>
                      openImageInFullScreen(
                        user.profilePhotoUrl ||
                          "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb"
                      )
                    }
                  >
                    <img
                      className="h-32 w-32 shadow-sm object-cover shadow-secondary rounded-full"
                      style={{ zIndex: 1 }}
                      src={
                        user.profilePhotoUrl ||
                        "https://firebasestorage.googleapis.com/v0/b/artgallery-972bd.appspot.com/o/istockphoto-1393750072-612x612.jpg?alt=media&token=ec7a7208-fcfd-483f-902c-fe3470a734bb"
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="flex justify-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {user.lastName}, {user.firstName} ,{" "}
                        {user.middleName || "N/A"}
                        <p className="text-sm text-gray-500">LRN: {user.lrn}</p>
                      </h2>
                    </div>
                  </div>
                  <div className="flex p-3 justify-between">
                    <div className=" flex justify-center gap-5 w-full">
                      {/* Open the modal using document.getElementById('ID').showModal() method */}
                      <button
                        className="btn  btn-sm btn-secondary text-white"
                        onClick={() =>
                          document
                            .getElementById("my_modal_" + user.id)
                            .showModal()
                        }
                      >
                        Edit Details
                      </button>
                      <label className="btn btn-sm btn-secondary text-white">
                        Change Avatar
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, user.id)}
                        />
                      </label>
                      <dialog id={"my_modal_" + user.id} className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">Edit Details</h3>
                          <form className="py-4 px-4" method="dialog">
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                First Name
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Middle Name
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Last Name
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Gender
                              </label>
                              <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>

                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Contact
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                maxLength={11}
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Address
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                LRN
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                name="lrn"
                                value={formData.lrn}
                                maxLength={12}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <button
                                className="btn w-full btn-sm btn-secondary text-white"
                                onClick={(e) => handleSubmit(e, user.id)}
                              >
                                Save Changes
                              </button>
                              <button
                                className="btn w-full btn-sm btn-base text-black"
                                onClick={() =>
                                  document
                                    .getElementById("my_modal_" + user.id)
                                    .close()
                                }
                              >
                                Cancel Editing
                              </button>
                            </div>
                          </form>
                        </div>
                      </dialog>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <p className="mt-1 text-sm text-gray-500">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-gray-500">Gender: {user.gender}</p>
                  <p className="text-sm text-gray-500">
                    Phone Number: {user.contact}
                  </p>{" "}
                  <p className="text-sm text-gray-500">
                    Address: {user.address}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
