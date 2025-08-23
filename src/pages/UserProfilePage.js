import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Pencil,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from "react-bootstrap-icons";

const UserProfile = () => {
  // Static user data
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://placehold.co/100x100",
  });

  // Static addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      street: "456 Office Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "USA",
      isDefault: false,
    },
  ]);

  // Real orders from backend
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    isDefault: false,
  });

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://major-project1-backend-xi.vercel.app/api/orders"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddAddress = () => {
    const newId = addresses.length + 1;
    setAddresses([...addresses, { ...newAddress, id: newId }]);
    setShowAddAddress(false);
    setNewAddress({
      type: "Home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      isDefault: false,
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <Badge bg="success">
            <CheckCircle className="me-1" /> Delivered
          </Badge>
        );
      case "Shipped":
        return (
          <Badge bg="info">
            <CheckCircle className="me-1" /> Shipped
          </Badge>
        );
      case "Processing":
        return (
          <Badge bg="warning">
            <Clock className="me-1" /> Processing
          </Badge>
        );
      case "Pending":
        return (
          <Badge bg="secondary">
            <Clock className="me-1" /> Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge bg="danger">
            <XCircle className="me-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalItems = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading && orders.length === 0) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your orders...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Profile Header */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="rounded-circle mb-3"
                width="100"
                height="100"
              />
              <h3>{userData.name}</h3>
              <p className="text-muted">{userData.email}</p>
              <p className="text-muted">{userData.phone}</p>
            </Card.Body>
          </Card>

          {/* Personal Information */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Personal Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" value={userData.name} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={userData.email}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" value={userData.phone} readOnly />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Address Book */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Address Book</h5>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddAddress(true)}
              >
                <Plus className="me-1" /> Add New Address
              </Button>
            </Card.Header>
            <Card.Body>
              {addresses.map((address) => (
                <Card key={address.id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">
                        {address.type}{" "}
                        {address.isDefault && (
                          <Badge bg="primary">Default</Badge>
                        )}
                      </h6>
                      <div>
                        {!address.isDefault && (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => setDefaultAddress(address.id)}
                            >
                              Set Default
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteAddress(address.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="mb-1">{address.street}</p>
                    <p className="mb-1">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="mb-0">{address.country}</p>
                  </Card.Body>
                </Card>
              ))}
              {addresses.length === 0 && (
                <p className="text-muted text-center">
                  No addresses saved yet.
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Order History */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order History</h5>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowOrderHistory(true)}
                  className="me-2"
                >
                  View All Orders
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={fetchOrders}
                >
                  Refresh
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {orders.length === 0 ? (
                <p className="text-muted text-center">No orders found.</p>
              ) : (
                <>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 3).map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.substring(0, 8)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{getTotalItems(order)} items</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {orders.length > 3 && (
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        Showing 3 of {orders.length} orders
                      </small>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Address Modal */}
      <Modal show={showAddAddress} onHide={() => setShowAddAddress(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Address Type</Form.Label>
              <Form.Select
                value={newAddress.type}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, type: e.target.value })
                }
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                placeholder="Enter street address"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    placeholder="Enter city"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    placeholder="Enter state"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, zipCode: e.target.value })
                    }
                    placeholder="Enter ZIP code"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, country: e.target.value })
                    }
                    placeholder="Enter country"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Check
              type="checkbox"
              label="Set as default address"
              checked={newAddress.isDefault}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isDefault: e.target.checked })
              }
              className="mb-3"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddAddress(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAddress}>
            Save Address
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order History Modal */}
      <Modal
        show={showOrderHistory}
        onHide={() => setShowOrderHistory(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order History ({orders.length} orders)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orders.length === 0 ? (
            <p className="text-muted text-center">No orders found.</p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{getTotalItems(order)} items</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOrderHistory(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
