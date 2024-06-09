import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import "tailwindcss/tailwind.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminNavbar from "./AdminNavbar";
import logo from "../../assets/ASHI_LOGO.png";
import { storage } from "../../firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const AdminPersonnel = () => {
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState([]);

  // Function to fetch personnel data from Firestore
  const fetchPersonnel = async () => {
    const personnelCollection = collection(firestore, "personnel");
    const personnelSnapshot = await getDocs(personnelCollection);
    const personnelData = personnelSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPersonnel(personnelData);
  };

  useEffect(() => {
    fetchPersonnel();
  }, []); // Fetch personnel data on component mount

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

  const handleAddPersonnel = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Personnel",
      html:
        `<input id="name" class="swal2-input" placeholder="Name">` +
        `<input id="description" class="swal2-input" placeholder="Description">` +
        `<input type="file" id="image" class="swal2-file" placeholder="Image">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("name").value,
          document.getElementById("description").value,
          document.getElementById("image").files[0], // Get the selected file
        ];
      },
    });

    if (formValues) {
      const [newName, newDescription, newImage] = formValues;
      const randomFilename = generateRandomFilename(); // Generate a random filename

      try {
        // Add a new personnel document with form data
        const newPersonnelRef = await addDoc(
          collection(firestore, "personnel"),
          {
            name: newName,
            description: newDescription,
            imageUrl: "", // Add default imageUrl if needed
          }
        );

        // Fetch updated personnel data
        fetchPersonnel();

        // If a new image is selected, upload it to Firebase Storage and update imageUrl
        if (newImage) {
          const storageRef = ref(storage, `personnel/${randomFilename}`);
          const uploadTask = uploadBytesResumable(storageRef, newImage);

          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
            },
            () => {
              // Once image is uploaded, get its download URL and update Firestore
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateDoc(
                    doc(firestore, "personnel", newPersonnelRef.id),
                    {
                      imageUrl: downloadURL,
                    }
                  );
                }
              );
            }
          );
        }

        Swal.fire("Success!", "New personnel added successfully.", "success");
      } catch (error) {
        console.error("Error adding new personnel:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while adding new personnel.",
          icon: "error",
        });
      }
    }
  };

  // Function to generate a random filename
  const generateRandomFilename = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomFilename = "";
    const length = 10; // Change this to adjust the length of the filename

    for (let i = 0; i < length; i++) {
      randomFilename += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return randomFilename;
  };

  return (
    <div className="h-full">
      <AdminNavbar className="md:hidden" />
      <div className="flex h-screen bg-gray-100">
        <Sidebar handleLogout={handleLogout} />
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-center font-bold text-3xl pb-2">Personnel</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personnel.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  fetchPersonnel={fetchPersonnel}
                />
              ))}
            </div>
            <div className="text-center mt-4">
              <button onClick={handleAddPersonnel} className="btn btn-primary">
                Add Personnel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to display each personnel as a card
const PersonCard = ({ person }) => {
  const { id, name, description, imageUrl } = person;
  const [image, setImage] = useState(null);

  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        // Delete the personnel document from Firestore
        await deleteDoc(doc(firestore, "personnel", id));

        // If there's an image, delete it from Firebase Storage
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }

        Swal.fire("Deleted!", "The personnel has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting personnel:", error);
        Swal.fire(
          "Error!",
          "An error occurred while deleting personnel.",
          "error"
        );
      }
    }
  };

  const handleEdit = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Personnel",
      html:
        `<input id="name" class="swal2-input" placeholder="Name" value="${name}">` +
        `<input id="description" class="swal2-input" placeholder="Description" value="${description}">` +
        `<input type="file" id="image" class="swal2-file" placeholder="Image">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("name").value,
          document.getElementById("description").value,
          document.getElementById("image").files[0], // Get the selected file
        ];
      },
    });

    if (formValues) {
      const [newName, newDescription, newImage] = formValues;
      const randomFilename = generateRandomFilename(); // Generate a random filename

      try {
        // Update name and description in Firestore
        await updateDoc(doc(firestore, "personnel", id), {
          name: newName,
          description: newDescription,
        });

        // If a new image is selected, upload it to Firebase Storage and update imageUrl
        if (newImage) {
          const storageRef = ref(storage, `personnel/${randomFilename}`);
          const uploadTask = uploadBytesResumable(storageRef, newImage);

          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
            },
            () => {
              // Once image is uploaded, get its download URL and update Firestore
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateDoc(doc(firestore, "personnel", id), {
                    imageUrl: downloadURL,
                  });
                  setImage(downloadURL); // Set local state with new image URL
                }
              );
            }
          );
        }

        Swal.fire(
          "Success!",
          "Personnel details updated successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error updating personnel details:", error);
        Swal.fire(
          "Error!",
          "An error occurred while updating personnel details.",
          "error"
        );
      }
    }
  };

  // Function to generate a random filename
  const generateRandomFilename = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomFilename = "";
    const length = 10; // Change this to adjust the length of the filename

    for (let i = 0; i < length; i++) {
      randomFilename += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return randomFilename;
  };

  return (
    <div className="bg-white flex flex-col justify-between shadow-md rounded-lg p-4">
      <img
        src={image || imageUrl}
        alt={name}
        className="w-full h-40 object-cover mb-4"
      />
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="flex justify-between mt-4">
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
        <button onClick={handleEdit} className="btn btn-secondary">
          Edit
        </button>
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

export default AdminPersonnel;
