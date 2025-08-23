import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
  Badge,
} from "react-bootstrap";
import { Plus, Pencil, Trash, Check } from "react-bootstrap-icons";
import { useAddress } from "../context/AddressContext";

const AddressPage = () => {
  const {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  } = useAddress();
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  const handleShowModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        phone: "",
        isDefault: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
    } else {
      addAddress(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddress(addressId);
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Manage Addresses</h2>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <Plus className="me-2" />
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h4>No addresses yet</h4>
              <p>Add your first address to get started!</p>
            </Alert>
          ) : (
            <Row>
              {addresses.map((address) => (
                <Col md={6} lg={4} key={address._id} className="mb-4">
                  {" "}
                  {/* Use _id here */}
                  <Card
                    className={`h-100 ${
                      selectedAddress?._id === address._id
                        ? "border-primary"
                        : ""
                    }`}
                  >
                    <Card.Body>
                      {selectedAddress?.id === address.id && (
                        <div className="text-end mb-2">
                          <Badge bg="success">
                            <Check className="me-1" />
                            Selected
                          </Badge>
                        </div>
                      )}
                      <h6>{address.fullName}</h6>
                      <p className="mb-1">{address.street}</p>
                      <p className="mb-1">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="mb-1">{address.country}</p>
                      <p className="mb-3">Phone: {address.phone}</p>

                      <div className="d-grid gap-2">
                        <Button
                          variant={
                            selectedAddress?.id === address.id
                              ? "success"
                              : "outline-primary"
                          }
                          size="sm"
                          onClick={() => selectAddress(address)}
                        >
                          {selectedAddress?.id === address.id
                            ? "Selected"
                            : "Select for Delivery"}
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleShowModal(address)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(address.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Add/Edit Address Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAddress ? "Edit Address" : "Add New Address"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street Address *</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP Code *</Form.Label>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              name="isDefault"
              label="Set as default address"
              checked={formData.isDefault}
              onChange={handleInputChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingAddress ? "Update Address" : "Add Address"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AddressPage;
