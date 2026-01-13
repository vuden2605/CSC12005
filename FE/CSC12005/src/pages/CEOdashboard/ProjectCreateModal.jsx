import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import { ManagerService } from "../../services/ManagerService";

// Panel tạo project hiển thị inline bên trong dashboard (không dùng modal)
const ProjectCreateModal = ({ isOpen, toggle, onProjectCreated, inline = false }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setError("Vui lòng nhập tên project.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const projectData = {
        projectName: projectName.trim(),
        description: projectDesc.trim(),
      };

      const newProject = await ManagerService.createProject(projectData);

      console.log("Project created:", newProject);

      // Reset form
      setProjectName("");
      setProjectDesc("");

      // Notify parent component
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
    } catch (err) {
      setError(err.message || "Không thể tạo project");
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  // Nếu là inline mode, hiển thị form trực tiếp
  if (inline) {
    return (
      <div className="project-create-panel">
        {error && <div className="error-text">{error}</div>}
        <div className="field">
          <label>Tên project</label>
          <Input
            className="short-input"
            type="text"
            placeholder="Nhập tên project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="actions">
          <Button
            color="primary"
            onClick={handleCreateProject}
            disabled={!projectName.trim() || loading}
          >
            {loading ? "Đang tạo..." : "Tạo project"}
          </Button>
        </div>
      </div>
    );
  }

  // Modal mode (giữ lại cho tương thích)
  return null;
};

export default ProjectCreateModal;
