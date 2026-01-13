import React, { useState } from "react";
import { Button, Input } from "reactstrap";

// Panel tạo project hiển thị inline bên trong dashboard (không dùng modal)
const ProjectCreateModal = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const handleCreateProject = () => {
    // TODO: call API tạo project tại đây
    console.log("Project created:", {
      name: projectName,
      description: projectDesc,
    });
    setProjectName("");
    setProjectDesc("");
  };

  return (
    <div className="project-create-panel">
      <div className="field">
        <label>Tên project</label>
        <Input
          className="short-input"
          type="text"
          placeholder="Nhập tên project"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Mô tả chi tiết về đồ án</label>
        <Input
          type="textarea"
          rows="3"
          placeholder="Nhập mô tả chi tiết, mục tiêu, phạm vi..."
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />
      </div>

      <div className="actions">
        <Button
          color="primary"
          onClick={handleCreateProject}
          disabled={!projectName.trim()}
        >
          Tạo project
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
