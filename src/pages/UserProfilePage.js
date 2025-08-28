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
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  Pencil,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  PersonCircle,
  Trash,
} from "react-bootstrap-icons";

const UserProfile = () => {
  // Static user data
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profileImage: null, // Set to null to use default image
  });

  // Addresses with localStorage persistence
  const [addresses, setAddresses] = useState(() => {
    // Load addresses from localStorage on initial render
    try {
      const savedAddresses = localStorage.getItem("userAddresses");
      if (savedAddresses) {
        return JSON.parse(savedAddresses);
      }
    } catch (error) {
      console.error("Error loading addresses from localStorage:", error);
    }
    // Default addresses if none in localStorage
    return [
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
    ];
  });

  // Real orders from backend
  const [orders, setOrders] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Modal states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    isDefault: false,
  });

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userAddresses", JSON.stringify(addresses));
  }, [addresses]);

  // Sort orders by date (most recent first)
  useEffect(() => {
    const sorted = [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA; // Most recent first
    });
    setSortedOrders(sorted);
  }, [orders]);

  // Show toast notification
  const showNotification = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    
    // Simulate a small delay to show the loading state
    const loadingDelay = setTimeout(() => {
      // This ensures the spinner is visible for at least 500ms
    }, 500);
    
    try {
      const response = await fetch(
        "https://major-project1-backend-xi.vercel.app/api/orders"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const ordersData = await response.json();
      setOrders(ordersData);
      showNotification("Orders loaded successfully!");
    } catch (err) {
      console.error("Error fetching orders:", err);
      showNotification("Failed to load orders. Please try again.", "danger");
    } finally {
      clearTimeout(loadingDelay);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddAddress = () => {
    const newId = Date.now(); // Use timestamp for unique ID
    const updatedAddresses = [...addresses, { ...newAddress, id: newId }];
    
    // If setting as default, remove default from other addresses
    if (newAddress.isDefault) {
      updatedAddresses.forEach(addr => {
        if (addr.id !== newId) {
          addr.isDefault = false;
        }
      });
    }
    
    setAddresses(updatedAddresses);
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
    
    showNotification("Address added successfully!");
  };

  const setDefaultAddress = (id) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    showNotification("Default address updated!");
  };

  const confirmDeleteAddress = (id) => {
    const address = addresses.find(addr => addr.id === id);
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  const deleteAddress = () => {
    if (!addressToDelete) return;
    
    const id = addressToDelete.id;
    const updatedAddresses = addresses.filter((addr) => addr.id !== id);
    
    // If deleting the default address, set a new default if available
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    setAddresses(updatedAddresses);
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
    showNotification("Address deleted successfully!");
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
      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          bg={toastVariant}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Profile Header */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  width="100"
                  height="100"
                />
              ) : (
                <div className="mb-3">
                  <PersonCircle 
                    className="text-secondary" 
                    width="100" 
                    height="100" 
                  />
                </div>
              )}
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
                  <div className="mb-3">
                    <p className="text-muted mb-1">Full Name</p>
                    <p className="mb-0">{userData.name}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <p className="text-muted mb-1">Email Address</p>
                    <p className="mb-0">{userData.email}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <p className="text-muted mb-1">Phone Number</p>
                    <p className="mb-0">{userData.phone}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Address Book */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Manage Addresses</h5>
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
                              onClick={() => confirmDeleteAddress(address.id)}
                            >
                              <Trash className="me-1" /> Delete
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
                  No addresses saved yet. Add your first address!
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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Loading...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading orders...</span>
                  </Spinner>
                  <p className="mt-2">Loading your orders...</p>
                </div>
              ) : sortedOrders.length === 0 ? (
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
                      {sortedOrders.slice(0, 3).map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id?.substring(0, 8) || order.id}</td>
                          <td>{formatDate(order.createdAt || order.date)}</td>
                          <td>{getTotalItems(order)} items</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>${order.totalAmount?.toFixed(2) || "0.00"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {sortedOrders.length > 3 && (
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        Showing 3 of {sortedOrders.length} orders
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
                required
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
                    required
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
                    required
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
                    required
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
                    required
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
          <Button 
            variant="primary" 
            onClick={handleAddAddress}
            disabled={!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country}
          >
            Save Address
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Address Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this address?</p>
          {addressToDelete && (
            <Card className="mt-3">
              <Card.Body>
                <h6>{addressToDelete.type}</h6>
                <p className="mb-1">{addressToDelete.street}</p>
                <p className="mb-1">
                  {addressToDelete.city}, {addressToDelete.state} {addressToDelete.zipCode}
                </p>
                <p className="mb-0">{addressToDelete.country}</p>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAddress}>
            Delete Address
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
          <Modal.Title>Order History ({sortedOrders.length} orders)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading orders...</span>
              </Spinner>
              <p className="mt-2">Loading your orders...</p>
            </div>
          ) : sortedOrders.length === 0 ? (
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
                {sortedOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id?.substring(0, 8) || order.id}</td>
                    <td>{formatDate(order.createdAt || order.date)}</td>
                    <td>{getTotalItems(order)} items</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>${order.totalAmount?.toFixed(2) || "0.00"}</td>
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