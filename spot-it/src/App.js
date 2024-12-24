import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages :
import LandingPage from "./pages/AuthPages/LandingPage.js";
import Signup from "./pages/AuthPages/Signup.js";
import Login from "./pages/AuthPages/Login.js";
import VerificationCode from "./pages/AuthPages/VerificationCode.js";
import ForgotPassword from "./pages/AuthPages/ForgotPassword.js";
import ResetPassword from "./pages/AuthPages/ResetPassword.js";

// Post pages :
import CreatePost from "./pages/PostPages/CreatePost.js";
import UserPage from "./pages/PostPages/UserPage.js";
import CommentPage from "./pages/PostPages/CommentPage.js";
import EditPost from "./pages/PostPages/EditPost.js";

// Chat Pages :
import ChatPage from "./pages/ChatPages/ChatPage.js";

// Bell Pages :
import NotificationPage from "./pages/BellPages/NotificationPage.js";

// Profile Pages :
import ProfilePage from "./pages/ProfilePages/ProfilePage.js";

import "./App.css";
import { useAuthContext } from "./context/authContext.js";

function App() {
  const { authUser } = useAuthContext();

  const RedirectToLogin = ({ children, redirectTo = "/Spot-It/v1/login" }) => {
    return authUser ? children : <Navigate to={redirectTo} />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* any other path is sent to landing page: */}
          <Route path="*" element={<Navigate to="/Spot-It/v1/login" />} />
          <Route path="/Spot-It/v1/landing" element={<LandingPage />}></Route>
          <Route
            path="/Spot-It/v1/signup"
            element={
              authUser ? (
                <Navigate to="/Spot-It/v1/userin/userPage" />
              ) : (
                <Signup />
              )
            }
          ></Route>
          <Route
            path="/Spot-It/v1/login"
            element={
              authUser ? (
                <Navigate to="/Spot-It/v1/userin/userPage" />
              ) : (
                <Login />
              )
            }
          ></Route>
          <Route
            path="/Spot-It/v1/emailVerification"
            element={<VerificationCode />}
          ></Route>
          <Route
            path="/Spot-It/v1/forgotPassword"
            element={<ForgotPassword />}
          ></Route>
          <Route
            path="/Spot-It/v1/resetPassword"
            element={<ResetPassword />}
          ></Route>
          <Route
            path="/Spot-It/v1/userin/createPost"
            element={
              <RedirectToLogin>
                <CreatePost />
              </RedirectToLogin>
            }
          ></Route>
          <Route
            path="/Spot-It/v1/userin/userPage"
            element={
              <RedirectToLogin>
                <UserPage />
              </RedirectToLogin>
            }
          />
          <Route
            path="/Spot-It/v1/userin/notifications"
            element={
              <RedirectToLogin>
                <NotificationPage />
              </RedirectToLogin>
            }
          ></Route>
          <Route
            path="/Spot-It/v1/userin/userProfile"
            element={
              <RedirectToLogin>
                <ProfilePage />
              </RedirectToLogin>
            }
          ></Route>
          <Route
            path="/Spot-It/v1/userin/chat"
            element={
              <RedirectToLogin>
                <ChatPage />
              </RedirectToLogin>
            }
          ></Route>
          <Route
            path="/Spot-It/v1/userin/:postID/comments"
            element={
              <RedirectToLogin>
                <CommentPage />
              </RedirectToLogin>
            }
          ></Route>
          <Route
            path="/Spot-It/v1/userin/editPost"
            element={
              <RedirectToLogin>
                <EditPost />
              </RedirectToLogin>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
