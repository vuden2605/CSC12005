import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap';

const ProjectCreateModal = ({ isOpen, toggle }) => {
const [projectName, setProjectName] = useState('');

const handleCreateProject = () => {
    // Logic for creating a project
    console.log('Project created:', projectName);
    toggle(); // Close modal after submission
};

return (
    <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Create New Project</ModalHeader>
    <ModalBody>
        <Input
        type="text"
        placeholder="Enter project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        />
    </ModalBody>
    <ModalFooter>
        <Button color="primary" onClick={handleCreateProject}>
        Create Project
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
        Cancel
        </Button>
    </ModalFooter>
    </Modal>
);
};

export default ProjectCreateModal;
