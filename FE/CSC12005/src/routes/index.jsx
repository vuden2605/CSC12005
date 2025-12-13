import { Navigate } from "react-router-dom";
// import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Admin } from "../pages/Admin";
import { Manager } from "../pages/Manager";
import { Employee } from "../pages/Employee";
import { HRAdmin } from "../pages/HRAdmin";
import { LayoutDefault } from "../LayoutDefault";
import { Dashboard } from "../pages/Employee/Darshboard";
import { Information } from "../pages/Employee/Darshboard/Information";
import { PersonalInfo } from "../pages/Employee/Darshboard/Information/PersonalInfo";
import { InfoDetails } from "../pages/Employee/Darshboard/Information/InfoDetails/index";
import { SalaryInfo } from "../pages/Employee/Darshboard/Information/SalaryInfo";
import { Requests } from "../pages/Employee/Darshboard/Requests";
import { Activities } from "../pages/Employee/Darshboard/Activities";
import { RequestManager } from "../pages/RequestManager";
import EventPageHR from "../pages/EventHR";
export const routes = [
    { path: "/", element: <Navigate to="/login" replace /> },

  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      // { index: true, element: <Navigate to="/login" replace /> },
      { path: "admin", element: <Admin /> },
      { path: "manager/department", element: <Manager /> },
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
              // { path: "attendance", element: <Attendance /> },
              { path: "request", element: <Requests /> },
              { path: "event", element: <Activities /> },
              // { path: "score", element: <Score /> },
            ],
          },
        ],
      },
      { path: "hr/humans", element: <HRAdmin /> },
      { path: "manager", element: <Manager /> },
      { path: "hr/events", element: <EventPageHR /> },
      { path: "manager/requests", element: <RequestManager /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];
