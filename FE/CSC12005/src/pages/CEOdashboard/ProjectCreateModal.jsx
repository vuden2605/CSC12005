import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap';
import { ManagerService } from '../../services/ManagerService';

const ProjectCreateModal = ({ isOpen, toggle, onProjectCreated }) => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateProject = async () => {
        if (!projectName.trim()) {
            setError('Project name is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const projectData = {
                projectName: projectName.trim(),
                description: description.trim()
            };

            const newProject = await ManagerService.createProject(projectData);

            console.log('Project created:', newProject);

            // Reset form
            setProjectName('');
            setDescription('');

            // Close modal
            toggle();

            // Notify parent component
            if (onProjectCreated) {
                onProjectCreated(newProject);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error creating project:', err);
        } finally {
            setLoading(false);
        }
    };

return (
        <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Create New Project</ModalHeader>
        <ModalBody>
            {error && <div className="alert alert-danger">{error}</div>}
            <FormGroup>
                <Label for="projectName">Project Name *</Label>
                <Input
                    type="text"
                    id="projectName"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={loading}
                />
            </FormGroup>
            <FormGroup>
                <Label for="projectDescription">Description</Label>
                <Input
                    type="textarea"
                    id="projectDescription"
                    placeholder="Enter project description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                />
            </FormGroup>
        </ModalBody>
        <ModalFooter>
                <Button color="primary" onClick={handleCreateProject} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Project'}
                </Button>{' '}
                <Button color="secondary" onClick={toggle} disabled={loading}>
                    Cancel
                </Button>
        </ModalFooter>
        </Modal>
);
};

export default ProjectCreateModal;
