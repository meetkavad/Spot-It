import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoadingPage from "./pages/LoadingPage.js";

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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoadingPage />}></Route>
          <Route path="/Spot-It/v1/landing" element={<LandingPage />}></Route>
          <Route path="/Spot-It/v1/signup" element={<Signup />}></Route>
          <Route path="/Spot-It/v1/login" element={<Login />}></Route>
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
            element={<CreatePost />}
          ></Route>
          <Route
            path="/Spot-It/v1/userin/userPage"
            element={<UserPage />}
          ></Route>
          <Route
            path="/Spot-It/v1/userin/notifications"
            element={<NotificationPage />}
          ></Route>
          <Route
            path="/Spot-It/v1/userin/userProfile"
            element={<ProfilePage />}
          ></Route>
          <Route path="/Spot-It/v1/userin/chat" element={<ChatPage />}></Route>
          <Route
            path="/Spot-It/v1/userin/:postID/comments"
            element={<CommentPage />}
          ></Route>
          <Route
            path="/Spot-It/v1/userin/editPost"
            element={<EditPost />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
