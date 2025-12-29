import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ActivityDetailModal = ({ isOpen, toggle, activity }) => {
return (
    <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Activity Details</ModalHeader>
    <ModalBody>
        <h3>{activity.name}</h3>
        <p>Description: {activity.description}</p>
        {/* Add more details here */}
    </ModalBody>
    <ModalFooter>
        <Button color="secondary" onClick={toggle}>
        Close
        </Button>
    </ModalFooter>
    </Modal>
);
};

export default ActivityDetailModal;
