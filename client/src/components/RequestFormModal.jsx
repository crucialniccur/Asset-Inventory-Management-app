import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { submitRequest } from '../redux/slices/requestslice';

export default function RequestFormModal({ show, handleClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: '',
    reason: '',
    quantity: 1,
    urgency: 'Medium',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(submitRequest(form)).unwrap(); // ✅ wait and unwrap for errors
      handleClose(); // ✅ close modal only on success
    } catch (err) {
      alert('Failed to submit request. Please try again.');
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Submit New Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Request Title</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder='New, Repair, or Maintenance Request'
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              placeholder="Explain why you need this asset or repair..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min={1}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Urgency</Form.Label>
            <Form.Select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Submit Request</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
