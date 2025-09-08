import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Wrapper from "./components/Common/Wrapper";
import LoginLayout from "./components/Routes/LoginLayout";
import { useAuthContext } from "./context/AuthProvider";
import Alerts from "./pages/alerts/Alerts";
import Companies from "./pages/company/Companies";
import CompanyInfo from "./pages/company/CompanyInfo";
import EmployeeDetails from "./pages/contacts/ContactDetails";
import Contacts from "./pages/contacts/Contacts";
import Documents from "./pages/documents/Documents";
import ComingSoon from "./pages/filler/ComingSoon";
import PageNotFound from "./pages/filler/PageNotFound";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Portfolios from "./pages/portfolios/Portfolios";
import ProfileSettings from "./pages/profileSettings/ProfileSettings";
import Projects from "./pages/projects/Projects";
import ProjectsInfo from "./pages/projects/ProjectsInfo";
import Settings from "./pages/settings/Settings";
import TimesheetDetails from "./pages/timesheets/TimesheetDetails";
import Timesheets from "./pages/timesheets/Timesheets";
import { useHasAccessToFeature } from "./utils/helper/HasAccessToFeature";
import Cases from "./pages/cases/Cases";
import CaseDetails from "./pages/cases/CasesDetails";
import Survey from "./pages/survey/Survey";
import Interaction from "./pages/interaction/Interaction";
import AuthCallback from "./components/Common/AuthCallback";
import ProjectsTeam from "./pages/projects-team/ProjectsTeam";
import UploadedSheets from "./pages/Uploaded Sheets/UploadedSheets";
import ChatAssistant from "./pages/chat-assistant";
import ThankYouPage from "./pages/login/ThankYouPage";

function App() {
  const { authState, setAuthState } = useAuthContext();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("role"));
    setAuthState({
      ...authState,
      isLoggedIn: data?.isLoggedIn,
      userInfo: data?.userInfo,
      tokens: data?.tokens,
      rolesInfo: data?.rolesInfo,
    });
  }, []);
  // const { parentFunction } = useContext(FilterListContext);
  // const { fetchAlertData } = useContext(NotificationContext);
  // useEffect(() => {
  //   parentFunction();
  //   fetchAlertData();
  // }, []);

  const userAccess = useHasAccessToFeature("F001", "P000000003");
  const roleAccess = useHasAccessToFeature("F002", "P000000003");

  const routeConfigs = [
    {
      path: "portfolios",
      element: <Portfolios />,
      isAuth: useHasAccessToFeature("F032", "P000000003"),
    },
    {
      path: "accounts",
      element: <Companies />,
      isAuth: useHasAccessToFeature("F005", "P000000003"),
    },
    {
      path: "accounts/info",
      element: <CompanyInfo />,
      isAuth: true,
    },
    {
      path: "projects",
      element: <Projects />,
      isAuth: useHasAccessToFeature("F013", "P000000003"),
    },
    {
      path: "projects/info",
      element: <ProjectsInfo />,
      isAuth: true,
    },
    {
      path: "timesheets",
      element: <Timesheets />,
      isAuth: useHasAccessToFeature("F018", "P000000003"),
    },
    {
      path: "timesheets/details",
      element: <TimesheetDetails />,
      isAuth: true,
    },
    {
      path: "cases",
      element: <Cases />,
      isAuth: useHasAccessToFeature("F018", "P000000003"),
    },
    {
      path: "projects-team",
      element: <ProjectsTeam />,
      isAuth: useHasAccessToFeature("F018", "P000000003"),
    },
    {
      path: "uploaded-sheets",
      element: <UploadedSheets />,
      isAuth: useHasAccessToFeature("F018", "P000000003"),
    },
    {
      path: "chat-assistant",
      element: <ChatAssistant />,
      isAuth: useHasAccessToFeature("F018", "P000000003"),
    },
    {
      path: "cases/details",
      element: <CaseDetails />,
      isAuth: true,
    },
    {
      path: "Employees",
      element: <Contacts />,
      isAuth: useHasAccessToFeature("F033", "P000000003"),
    },
    {
      path: "employees/info",
      element: <EmployeeDetails />,
      isAuth: true,
    },
    {
      path: "documents",
      element: <Documents />,
      isAuth: useHasAccessToFeature("F029", "P000000003"),
    },
    { path: "news", element: <ComingSoon />, isAuth: false },
    { path: "profile-settings", element: <ProfileSettings />, isAuth: true },
    {
      path: "settings",
      element: <Settings />,
      isAuth: userAccess || roleAccess,
    },
    { path: "workflows", element: <ComingSoon />, isAuth: false },
    { path: "reports", element: <ComingSoon />, isAuth: false },
    { path: "users", element: <ComingSoon />, isAuth: true },
    {
      path: "alerts",
      element: <Alerts />,
      isAuth: useHasAccessToFeature("F041", "P000000003"),
    },
  ];

  return (
    <Routes>
      <Route path="/login" element={<LoginLayout />}>
        <Route index element={<Login page={"signIn"} />} />
        <Route path="forgot-password" element={<Login page={"forgotPass"} />} />
        <Route path="contact-support" element={<Login page={"contactsupport"} />} />
      </Route>
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} /> {/* Add the AuthCallback route */}
      <Route path="/" element={<Wrapper />}>
        <Route index element={<Home />}></Route>
        {routeConfigs.map(({ path, element, isAuth }) => {
          if (isAuth) {
            return <Route key={path} path={path} element={element} />;
          }
          return null;
        })}
      </Route>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/interaction" element={<Interaction />} />
    </Routes>
  );
}

export default App;
