import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import { NotificationContext } from "../../context/NotificationContext";
import FloatingNotifications from "./FloatingNotifications";
import Header from "./Header";
import Navbar from "./Navbar";
import ResetPasswordModal from "../Homepage/ResetPasswordModal";

function Wrapper() {
  const { alerts, isNotificationVisible } = useContext(NotificationContext);
  const location = useLocation();
  const { authState } = useAuthContext();

  const [noteModal, setNoteModal] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("role")) {
      setNoteModal(
        JSON.parse(localStorage.getItem("role"))?.userInfo?.isPassResetRequired
      );
    }
  }, [location.pathname]);

  const handleNoteModalClose = () => {
    setNoteModal(false);
  };
  if (!authState?.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Navbar />
      {isNotificationVisible && location.pathname !== "/" && (
        <FloatingNotifications tasks={alerts} />
      )}
      <div>
        <Outlet />
        <ResetPasswordModal
          open={noteModal}
          handleClose={handleNoteModalClose}
        />
      </div>
    </>
  );
}

export default Wrapper;
