// import React from "react";
// import logo from "../assets/img/logo/Symbol.png";
// import { Navbar } from "react-bootstrap";
// import { BsQuestionCircleFill } from "react-icons/bs";
// import { FaStethoscope, FaTablets, FaVial, FaXRay } from "react-icons/fa";
// import { Link, NavLink } from "react-router-dom";

// export default function SideBar(props) {
//   return (
//     <>
//       <aside id="sidebar" className="sidebar">
//         <div className="border-bottom rounded-bottom shadow-5 mb-5">
//           <Navbar.Brand className="logo mb-4 ">
//             <Link to="/home">
//               <img
//                 src={logo}
//                 alt="Logo"
//                 style={{ height: "50px", marginRight: "5px" }}
//               />
//             </Link>
//             <span>MedRecChain</span>
//           </Navbar.Brand>
//         </div>
//         <ul className="sidebar-nav mt-4 " id="sidebar-nav">
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/patientProfile">
//               <i className="bi bi-grid">
//                 <FaStethoscope />
//               </i>
//               <span>{props.tap1}</span>
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link " to="/patientRecords">
//               <i className="bi bi-grid">
//                 <FaVial />
//               </i>
//               <span>{props.tap2}</span>
//             </NavLink>
//           </li>

//           <li className="nav-item">
//             <NavLink className="nav-link" to="/patientPermission">
//               <i className="bi bi-grid">
//                 <FaXRay />
//               </i>
//               <span>{props.tap3}</span>
//             </NavLink>
//           </li>

//           <li className="nav-item">
//             <NavLink className="nav-link" to="/patientDoctorNotes">
//               <i className="bi bi-grid">
//                 <FaTablets />
//               </i>
//               <span>{props.tap4}</span>
//             </NavLink>
//           </li>

//         </ul>
//       </aside>
//     </>
//   );
// }
