import React from "react";
import "../style.scss";
import CandidateList from "../../../components/CandidateList";
import InfoCard from "../../../components/InfoCard";
import { useSelector } from "react-redux";

export const ManagerCandidates = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const employee = {
    name: currentUser?.fullName || "Quản lý phòng ban",
    role: currentUser?.position?.positionName || "Quản lý",
    avatar: "👨‍💼",
  };

  return (
    <div className="employee-container">
      <InfoCard employee={employee} />

      <h1 className="page-title">Ứng viên của phòng ban</h1>

      <div className="employee-list-card">
        <CandidateList isLeader={true} />
      </div>
    </div>
  );
};
