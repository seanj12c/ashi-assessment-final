import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import Login from "./pages/authentication/Login";
import Registration from "./pages/authentication/Registration";
import Hero from "./pages/Hero";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./authContext";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminMV from "./pages/admin/AdminMV";
import Assessment from "./pages/Assessment";
import { AiOutlineLoading } from "react-icons/ai";
import ViewResults from "./pages/ViewResults";
import AdminPersonnel from "./pages/admin/AdminPersonnel";

function AppRoutes() {
  const location = useLocation();

  const navbarHiddenRoutes = [
    "/",
    "/register",
    "/admin/dashboard",
    "/admin/students",
    "/admin/mission_vision",
    "/admin/personnel",
  ];

  const isNavbarHidden = navbarHiddenRoutes.includes(location.pathname);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        try {
          const docRef = doc(firestore, "users", authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            localStorage.setItem("userData", JSON.stringify(docSnap.data()));
            console.log("Fetched user data:", docSnap.data());
          } else {
            setUserData(null);
            localStorage.removeItem("userData");
            console.log("User data does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching user data
        }
      } else {
        setUser(null);
        setUserData(null);
        localStorage.removeItem("userData");
        setLoading(false); // Set loading to false if no user is authenticated
      }
    });

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AiOutlineLoading size={60} className="animate-spin" />
      </div>
    ); // Render loading indicator while fetching data
  }

  const isAdmin =
    user && user.email === "amayaschoolofhomeindustries@gmail.com";

  return (
    <div className="App">
      {!isNavbarHidden && <Navbar />}

      <Routes>
        {/* Routes */}
        {!isAdmin && (
          <>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/home" /> : <Registration />}
            />
            <Route
              path="/home"
              element={user ? <Hero /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/" />}
            />
            <Route
              path="/assessment"
              element={user ? <Assessment /> : <Navigate to="/" />}
            />{" "}
            <Route
              path="/view-results"
              element={user ? <ViewResults /> : <Navigate to="/" />}
            />
          </>
        )}

        {isAdmin && (
          <>
            <Route
              path="/"
              element={isAdmin ? <Navigate to="/admin/dashboard" /> : <Login />}
            />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/mission_vision" element={<AdminMV />} />
            <Route path="/admin/personnel" element={<AdminPersonnel />} />
          </>
        )}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
