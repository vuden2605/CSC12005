import React, { useState } from 'react';
import EmployeeList from '../../components/EmployeeList';
import CompanyActivityList from './CompanyActivityList';
import ProjectCreateModal from './ProjectCreateModal';
import { Button } from 'reactstrap';
import './style.scss';

const CEODashboard = () => {
const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

const toggleProjectModal = () => setIsProjectModalOpen(!isProjectModalOpen);

return (
    <div>
    <h1>CEO Dashboard</h1>

      {/* Employee List Section */}
    <section>
        <h2>Employees by Department</h2>
        <EmployeeList />
    </section>

      {/* Create Project Button */}
    <Button color="primary" onClick={toggleProjectModal}>
        Create New Project
    </Button>

      {/* Company Activity Section */}
    <section>
        <h2>Company Activities</h2>
        <CompanyActivityList />
    </section>

      {/* Modal for Creating Project */}
    <ProjectCreateModal isOpen={isProjectModalOpen} toggle={toggleProjectModal} />
    </div>
);
};

export default CEODashboard;
