import React, { useState } from 'react';

const ProjectCreateModal = ({ isOpen, toggle }) => {
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = () => {
    console.log('Project created:', projectName);
    toggle();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h4>Tạo dự án mới</h4>
          <button className="modal-close" onClick={toggle} aria-label="Đóng">×</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Nhập tên dự án"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="modal-input"
          />
        </div>
        <div className="modal-footer">
          <button className="modal-btn primary" onClick={handleCreateProject}>Tạo dự án</button>
          <button className="modal-btn" onClick={toggle}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
