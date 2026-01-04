import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/employee/dashboard" replace />;
  }
  return children;
};

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// PAGES
import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Manager } from "../pages/Manager";
import { Employee } from "../pages/Employee";
import { HRAdmin } from "../pages/HRAdmin";
import { LayoutDefault } from "../LayoutDefault";

import { Dashboard } from "../pages/Employee/Darshboard";
import { Information } from "../pages/Employee/Darshboard/Information";
import { PersonalInfo } from "../pages/Employee/Darshboard/Information/PersonalInfo";
import { InfoDetails } from "../pages/Employee/Darshboard/Information/InfoDetails";
import { SalaryInfo } from "../pages/Employee/Darshboard/Information/SalaryInfo";
import { Requests } from "../pages/Employee/Darshboard/Requests";
import { Activities } from "../pages/Employee/Darshboard/Activities";
import { Attendance } from "../pages/Employee/Darshboard/Attendance";

import { Salary } from "../pages/Employee/Darshboard/Salary";

import { RequestManager } from "../pages/RequestManager";
import { EventPageHR } from "../pages/EventHR";
import { HRPayRoll } from "../pages/HRPayRoll";
import { BonusPoints } from "../pages/Employee/Darshboard/BonusPoints";

import { BonusPointsAdmin } from "../pages/BonusPointsAdmin";
import { ManagerProjects } from "../pages/Manager/ManagerProjects";
import CEODashboard from "../pages/CEOdashboard";


export const routes = [
  // Redirect root
  { path: "/", element: <Navigate to="/login" replace /> },

  //PRIVATE AREA
  {
    path: "/",
    element: (
      <PrivateRoute>
        <LayoutDefault />
      </PrivateRoute>
    ),
    children: [
      { path: "admin", element: <Admin /> },
      { path: "ceo/dashboard", element: <CEODashboard /> },

      { path: "manager", element: <Manager /> },
      { path: "manager/department", element: <Manager /> },
      { path: "manager/projects", element: <ManagerProjects /> },
      { path: "manager/requests", element: <RequestManager /> },
      { path: "manager/requests/:id", element: <RequestManager /> },

      {
        path: "employee",
        element: <Employee />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              { index: true, element: <Information /> },
              {
                path: "info",
                element: <Information />,
                children: [
                  { index: true, element: <PersonalInfo /> },
                  { path: "personal-info", element: <PersonalInfo /> },
                  { path: "info-details", element: <InfoDetails /> },
                  { path: "salary-info", element: <SalaryInfo /> },
                ],
              },
              { path: "attendance", element: <Attendance /> },
              { path: "request", element: <Requests /> },
              { path: "event", element: <Activities /> },
              { path: "salary", element: <Salary /> },
              { path: "bonus-points", element: <BonusPoints /> },
              // { path: "score", element: <Score /> },
            ],
          },
        ],
      },

      { path: "hr/humans", element: <HRAdmin /> },
      { path: "hr/events", element: <EventPageHR /> },
      { path: "hr/payroll", element: <HRPayRoll /> },
      { path: "hr/bonus-points", element: <BonusPointsAdmin /> },
    ],
  },

  //PUBLIC
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
];
