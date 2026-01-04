import React, { useState, useEffect } from 'react';
import EmployeeList from '../../components/EmployeeList';
import CompanyActivityList from './CompanyActivityList';
import ProjectCreateModal from './ProjectCreateModal';
import { Button } from 'reactstrap';
import { CEOService } from '../../services/CEOService';
import './style.scss';

const CEODashboard = () => {
const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
const [companyStats, setCompanyStats] = useState(null);
const [employeesByDepartment, setEmployeesByDepartment] = useState([]);
const [projectOverview, setProjectOverview] = useState(null);
const [activityStats, setActivityStats] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const toggleProjectModal = () => setIsProjectModalOpen(!isProjectModalOpen);

useEffect(() => {
    const fetchCEOData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [stats, employeesDept, projects, activities] = await Promise.all([
                CEOService.getCompanyStats(),
                CEOService.getEmployeesByDepartment(),
                CEOService.getProjectOverview(),
                CEOService.getActivityStats()
            ]);

            setCompanyStats(stats);
            setEmployeesByDepartment(employeesDept);
            setProjectOverview(projects);
            setActivityStats(activities);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching CEO data:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchCEOData();
}, []);

return (
    <div>
    <h1>CEO Dashboard</h1>

      {/* Company Overview Section */}
    <section>
        <h2>Company Overview</h2>
        {loading && <div>Loading company data...</div>}
        {error && <div>Error: {error}</div>}
        {companyStats && (
            <div>
                <p>Total Employees: {companyStats.totalEmployees}</p>
                <p>Total Departments: {companyStats.totalDepartments}</p>
                <p>Total Projects: {companyStats.totalProjects}</p>
                <p>Total Activities: {companyStats.totalActivities}</p>
            </div>
        )}
        {employeesByDepartment.length > 0 && (
            <div>
                <h3>Employees by Department</h3>
                {employeesByDepartment.map((dept) => (
                    <p key={dept.departmentId}>{dept.departmentName}: {dept.employeeCount} employees</p>
                ))}
            </div>
        )}
        {projectOverview && (
            <div>
                <h3>Project Overview</h3>
                <p>Active Projects: {projectOverview.activeProjects}</p>
                <p>Completed Projects: {projectOverview.completedProjects}</p>
                <p>Total Budget: {projectOverview.totalBudget}</p>
            </div>
        )}
        {activityStats && (
            <div>
                <h3>Activity Statistics</h3>
                <p>Total Activities: {activityStats.totalActivities}</p>
                <p>Upcoming Activities: {activityStats.upcomingActivities}</p>
                <p>Completed Activities: {activityStats.completedActivities}</p>
            </div>
        )}
    </section>

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
