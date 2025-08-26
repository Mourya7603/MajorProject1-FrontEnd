import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useAddress } from "../context/AddressContext";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { addresses, selectedAddress, selectAddress, fetchAddresses } = useAddress();
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Fetch addresses when component mounts
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        await fetchAddresses();
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    
    loadAddresses();
  }, [fetchAddresses]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const getUserId = () => {
    return "68a2d027f17a6dbb2ee3e0ab"; // Your demo user ID
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Format order data to match backend schema EXACTLY
      const orderData = {
        user: getUserId(),
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: selectedAddress._id, // Use _id instead of id
        totalAmount: total,
        status: "Pending",
        paymentStatus: "Pending",
      };

      console.log(
        "Sending order to backend:",
        JSON.stringify(orderData, null, 2)
      );

      // Send order to backend
      const response = await fetch(
        "https://major-project1-backend-xi.vercel.app/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newOrder = await response.json();

      console.log("Order created successfully:", newOrder);

      // Update local context
      placeOrder(newOrder);
      setOrderDetails(newOrder);
      setOrderPlaced(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setPaymentCompleted(true);
        clearCart();
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      console.error("Order placement error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="text-center border-0 shadow">
              <Card.Body className="p-5">
                {/* Success Icon */}
                <div className="mb-4">
                  <div 
                    className={`rounded-circle d-inline-flex align-items-center justify-content-center ${paymentCompleted ? "bg-success" : "bg-primary"}`}
                    style={{ width: "100px", height: "100px" }}
                  >
                    <i 
                      className={`fas ${paymentCompleted ? "fa-check-double" : "fa-check"} text-white`}
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                </div>
                
                {/* Title */}
                <h2 className="mb-3">
                  {paymentCompleted ? "Payment Completed Successfully!" : "Order Placed Successfully!"}
                </h2>
                
                {/* Subtitle */}
                <p className="text-muted mb-4">
                  {paymentCompleted 
                    ? "Your payment has been processed successfully." 
                    : "Thank you for your order. Your payment is being processed."}
                </p>
                
                {/* Order Details */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Order Details</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-2">
                      <Col sm={6}>
                        <strong>Order Number:</strong>
                      </Col>
                      <Col sm={6} className="text-sm-end">
                        #{orderDetails._id?.slice(-8) || orderDetails.id?.slice(-8) || "N/A"}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={6}>
                        <strong>Order Date:</strong>
                      </Col>
                      <Col sm={6} className="text-sm-end">
                        {new Date().toLocaleDateString()}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={6}>
                        <strong>Total Amount:</strong>
                      </Col>
                      <Col sm={6} className="text-sm-end">
                        <strong>${orderDetails.totalAmount?.toFixed(2) || total.toFixed(2)}</strong>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm={6}>
                        <strong>Payment Method:</strong>
                      </Col>
                      <Col sm={6} className="text-sm-end">
                        Credit Card
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <strong>Payment Status:</strong>
                      </Col>
                      <Col sm={6} className="text-sm-end">
                        <Badge bg={paymentCompleted ? "success" : "warning"}>
                          {paymentCompleted ? "Completed" : "Processing"}
                        </Badge>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Delivery Information */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Delivery Information</h5>
                  </Card.Header>
                  <Card.Body className="text-start">
                    <p className="mb-1">
                      <strong>Delivery Address:</strong>
                    </p>
                    <p className="mb-1">
                      {selectedAddress.fullName}
                    </p>
                    <p className="mb-1">
                      {selectedAddress.street}, {selectedAddress.city}
                    </p>
                    <p className="mb-1">
                      {selectedAddress.state}, {selectedAddress.zipCode}
                    </p>
                    <p className="mb-0">
                      {selectedAddress.country}
                    </p>
                    <p className="mb-0">
                      <strong>Phone:</strong> {selectedAddress.phone}
                    </p>
                    
                    <hr />
                    
                    <p className="mb-1">
                      <strong>Estimated Delivery:</strong>
                    </p>
                    <p className="mb-0">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </Card.Body>
                </Card>
                
                
                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/products")}
                    className="me-md-2"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate("/profile")}
                  >
                    View Order Details
                  </Button>
                </div>
                
                {/* Support Information */}
                <div className="mt-4 pt-3 border-top">
                  <p className="small text-muted mb-0">
                    Need help? Contact our support team at support@example.com or call 1-800-123-4567
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Checkout</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        {/* Order Summary */}
        <Col lg={5}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({getCartCount()} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className={shipping === 0 ? "text-success" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (18%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || cart.length === 0 || loading}
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
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              {!selectedAddress && (
                <Alert variant="warning" className="mt-3 mb-0">
                  Please select a delivery address
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Address Selection */}
        <Col lg={7}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Select Delivery Address</h5>
            </Card.Header>
            <Card.Body>
              {addresses.length === 0 ? (
                <Alert variant="info">
                  <p>No addresses found. Please add an address to continue.</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/address")}
                  >
                    Add Address
                  </Button>
                </Alert>
              ) : (
                <div className="row">
                  {addresses.map((address) => (
                    <div
                      className="col-md-6 mb-3"
                      key={address._id || address.id}
                    >
                      <Card
                        className={`h-100 cursor-pointer ${
                          selectedAddress?._id === address._id ||
                          selectedAddress?.id === address.id
                            ? "border-primary"
                            : ""
                        }`}
                        onClick={() => selectAddress(address)}
                        style={{ cursor: "pointer" }}
                      >
                        <Card.Body>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="address"
                              checked={
                                selectedAddress?._id === address._id ||
                                selectedAddress?.id === address.id
                              }
                              onChange={() => selectAddress(address)}
                            />
                            <label className="form-check-label w-100">
                              <strong>{address.fullName}</strong>
                              <br />
                              {address.street}
                              <br />
                              {address.city}, {address.state} {address.zipCode}
                              <br />
                              {address.country}
                              <br />
                              Phone: {address.phone}
                              {address.isDefault && (
                                <Badge bg="primary" className="ms-2">
                                  Default
                                </Badge>
                              )}
                            </label>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline-primary"
                onClick={() => navigate("/address")}
                className="mt-3"
              >
                Manage Addresses
              </Button>
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Items ({getCartCount()})</h5>
            </Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <Alert variant="info">
                  Your cart is empty.{" "}
                  <Button
                    variant="primary"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </Button>
                </Alert>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex align-items-center mb-3"
                  >
                    <img
                      src={item.image || "https://placehold.co/60x60"}
                      alt={item.name}
                      className="rounded me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                      <small className="text-muted">${item.price} each</small>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;