import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import GithubProfilePage from './pages/GithubProfilePage';

export const API_BASE_URL = "http://localhost:8080";

function App() {
  const [loggedInPhoneNumber, setLoggedInPhoneNumber] = useState(
    localStorage.getItem("loggedInPhoneNumber")
  );
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const fetchUserProfile = useCallback(async (phoneNumberToFetch) => {
    if (!phoneNumberToFetch) {
      setUserProfile(null);
      return;
    }
    setIsLoadingProfile(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/profile/?phoneNumber=${phoneNumberToFetch}`
      );
      console.log("Fetched user profile:", response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile({
        phoneNumber: phoneNumberToFetch,
        favorite_github_users: [],
      }); // Fallback
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("loggedInPhoneNumber");
    setLoggedInPhoneNumber(storedPhoneNumber);
    if (storedPhoneNumber) {
      fetchUserProfile(storedPhoneNumber);
    } else {
      setUserProfile(null);
    }
  }, [fetchUserProfile]);

  const AppContent = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (phoneNumber) => {
      localStorage.setItem("loggedInPhoneNumber", phoneNumber);
      setLoggedInPhoneNumber(phoneNumber);
      fetchUserProfile(phoneNumber);
      navigate("/search");
    };

    const handleLogout = () => {
      localStorage.removeItem("loggedInPhoneNumber");
      setLoggedInPhoneNumber(null);
      setUserProfile(null);
      navigate("/login");
    };

    return (
      <Routes>
        <Route
          path="/login"
          element={
            loggedInPhoneNumber ? (
              <Navigate to="/search" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/search"
          element={
            loggedInPhoneNumber ? (
              <SearchPage
                loggedInPhoneNumber={loggedInPhoneNumber}
                userProfileData={userProfile}
                refreshUserProfile={() => fetchUserProfile(loggedInPhoneNumber)}
                onLogout={handleLogout}
                isLoadingProfile={isLoadingProfile}

                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                isLoadingSearch={isLoadingSearch}
                setIsLoadingSearch={setIsLoadingSearch}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            loggedInPhoneNumber ? (
              <ProfilePage
                loggedInPhoneNumber={loggedInPhoneNumber}
                userProfileData={userProfile}
                onLogout={handleLogout}
                isLoadingProfile={isLoadingProfile}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/github-profile/:githubId"
          element={
            loggedInPhoneNumber ? (
              <GithubProfilePage onLogout={handleLogout} phoneNumber={loggedInPhoneNumber} /> 
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={loggedInPhoneNumber ? "/search" : "/login"} replace />
          }
        />
      </Routes>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
