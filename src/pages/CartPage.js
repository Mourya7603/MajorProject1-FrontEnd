import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { Heart, HeartFill, Trash, Plus, Dash } from "react-bootstrap-icons";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
    clearCart,
  } = useCart();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleMoveToWishlist = (product) => {
    removeFromCart(product._id);
    if (!isInWishlist(product._id)) {
      addToWishlist(product);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info" className="text-center">
          <h4>Your cart is empty</h4>
          <p>Add some products to your cart to get started!</p>
          <Button variant="primary" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </Alert>
      </Container>
    );
  }

  const totalItems = getCartCount();
  const totalAmount = getCartTotal();
  const shipping = totalAmount > 0 ? (totalAmount > 50 ? 0 : 5.99) : 0;
  const finalTotal = totalAmount + shipping;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </h2>
        <Button variant="outline-danger" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <Row>
        {/* Cart Items */}
        <Col lg={8}>
          {cart.map((item) => (
            <Card key={item._id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  {/* Product Image */}
                  <Col md={3}>
                    <img
                      src={item.image || "https://placehold.co/200x200"}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{
                        height: "120px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </Col>

                  {/* Product Details */}
                  <Col md={9}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="text-muted mb-1 small">{item.category}</p>
                        <p className="text-success fw-bold mb-2">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Rating */}
                        <div className="d-flex align-items-center mb-2">
                          <span className="text-warning">
                            {"★".repeat(Math.round(item.ratings || 0))}
                            {"☆".repeat(5 - Math.round(item.ratings || 0))}
                          </span>
                          <small className="text-muted ms-2">
                            ({item.ratings || 0})
                          </small>
                        </div>
                      </Col>

                      {/* Quantity Controls */}
                      <Col md={3}>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Dash />
                          </Button>

                          <span className="mx-3 fw-bold">{item.quantity}</span>

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                          >
                            <Plus />
                          </Button>
                        </div>
                        <small className="text-muted d-block mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </small>
                      </Col>

                      {/* Actions */}
                      <Col md={3} className="text-end">
                        <div className="d-flex flex-column gap-2">
                          <Button
                            variant={
                              isInWishlist(item._id)
                                ? "danger"
                                : "outline-danger"
                            }
                            size="sm"
                            onClick={() => handleMoveToWishlist(item)}
                            className="d-flex align-items-center justify-content-center"
                          >
                            {isInWishlist(item._id) ? (
                              <HeartFill className="me-1" />
                            ) : (
                              <Heart className="me-1" />
                            )}
                            Wishlist
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCart(item._id)}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <Trash className="me-1" />
                            Remove
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: "20px" }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({totalItems} items):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className={shipping === 0 ? "text-success" : ""}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {totalAmount < 50 && shipping > 0 && (
                <div className="alert alert-info py-2 mb-3">
                  <small>
                    Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
                  </small>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${finalTotal.toFixed(2)}</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 mb-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline-primary"
                className="w-100"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>

          {/* Promotional Message */}
          {totalAmount < 50 && (
            <Card className="mt-3 border-warning">
              <Card.Body className="text-center">
                <Badge bg="warning" text="dark" className="mb-2">
                  Free Shipping
                </Badge>
                <p className="small mb-0">
                  Spend ${(50 - totalAmount).toFixed(2)} more to get free
                  shipping!
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
