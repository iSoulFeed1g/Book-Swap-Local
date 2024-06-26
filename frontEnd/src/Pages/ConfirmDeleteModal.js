import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmDeleteModal({ show, handleClose, handleConfirm }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete your profile? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Back
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    Yes, I am sure
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmDeleteModal;
