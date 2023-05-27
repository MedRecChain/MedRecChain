import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
// import 'coreui/coreui/dist/css/coreui.min.css'

import "../src/assets/css/style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "react-bootstrap-icons";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import ContactUs from "./pages/ContactUs";
import ErrorPage from "./pages/ErrorPage";
import PatientRecords from "./pages/PatientRecords";
import PatientProfile from "./pages/PatientProfile";
import AddHospital from "./pages/AddHospital";
import AddDoctor from "./pages/AddDoctor";
import HospitalProfile from "./pages/HospitalProfile";
import AddPatient from "./pages/AddPatient";
import DoctorProfile from "./pages/DoctorProfile";
import PatientPermission from "./pages/PatientPermission";
import DoctorRequest from "./pages/DoctorRequest";
import AddRecord from "./pages/AddRecord";
import PatientRecordsForDoctor from "./pages/PatientRecordsForDoctor";
import RegisteredHospitals from "./pages/RegisteredHospitals";
import RegisteredPatients from "./pages/RegisteredPatients";
import RegisteredDoctors from "./pages/RegisteredDoctors";
import PreviewRecordForPatient from "./pages/PreviewRecordForPatient";
import PreviewRecordForDoctor from "./pages/PreviewRecordForDoctor";
import AllHospitals from "./pages/AllHospitals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/registeredHospitals",
    element: <RegisteredHospitals />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/registeredDoctors",
    element: <RegisteredDoctors />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/allhospitals",
    element: <AllHospitals />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/registeredPatients",
    element: <RegisteredPatients />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/patientPermission",
    element: <PatientPermission />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/patientRecords",
    element: <PatientRecords />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/previewRecordForDoctor",
    element: <PreviewRecordForDoctor />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/previewRecordForPatient",
    element: <PreviewRecordForPatient />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/patientProfile",
    element: <PatientProfile />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/about",
    element: <About />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/contact",
    element: <ContactUs />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addHospital",
    element: <AddHospital />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addDoctor",
    element: <AddDoctor />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addPatient",
    element: <AddPatient />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addRecord",
    element: <AddRecord />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/doctorProfile",
    element: <DoctorProfile />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/PatientRecordsForDoctor",
    element: <PatientRecordsForDoctor />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/doctorRequest",
    element: <DoctorRequest />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/hospitalProfile",
    element: <HospitalProfile />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
