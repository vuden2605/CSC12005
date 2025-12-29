// src/pages/CEODashboard/index.jsx
import React, { useState } from 'react';
import { Button } from 'reactstrap'; 
import EmployeeList from '../../components/EmployeeList';
import CompanyActivityList from './CompanyActivityList';
import ProjectCreateModal from './ProjectCreateModal';

const CEODashboard = () => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const toggleProjectModal = () => setIsProjectModalOpen(!isProjectModalOpen);

  return (
    <div>
      {/* Header Section */}
      <h1>CEO Dashboard</h1>

      {/* Employees by Department Section */}
      <section className="employees-section">
        <h2>Employees by Department</h2>
        <div className="employee-header">
          <Button color="primary" onClick={toggleProjectModal}>Create New Project</Button>
          <div className="action-buttons">
          </div>
        </div>
        <EmployeeList />
      </section>

      {/* Company Activities Section */}
      <section className="activities-section">
        <h2 className="activities-title">Company Activities</h2>
        <div className="activity-list">
          <div className="activity-item">
            <h3>Yearly Company Meeting</h3>
            <Button color="info" className="view-details-btn">View Details</Button>
          </div>
          <div className="activity-item">
            <h3>Product Launch Event</h3>
            <Button color="info" className="view-details-btn">View Details</Button>
          </div>
        </div>
      </section>

      {/* Modal for Creating Project */}
      <ProjectCreateModal isOpen={isProjectModalOpen} toggle={toggleProjectModal} />
    </div>
  );
};

export default CEODashboard;
