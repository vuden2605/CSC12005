import React from "react";
import "./style.scss";

export const EditButton = ({ label = "Sửa", onClick }) => {
  return (
    <button className="edit-btn" onClick={onClick}>
       {label}
    </button>
  );
};
