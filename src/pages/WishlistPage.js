import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { HeartFill, Cart } from "react-bootstrap-icons";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product._id);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-warning" : "text-muted"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (wishlist.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info" className="text-center">
          <HeartFill size={48} className="text-danger mb-3" />
          <h4>Your wishlist is empty</h4>
          <p>Start adding products you love to your wishlist!</p>
          <Button variant="primary" href="/products">
            Browse Products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Wishlist</h2>
        <Button variant="outline-danger" onClick={clearWishlist}>
          Clear Wishlist
        </Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {wishlist.map((product) => (
          <Col key={product._id}>
            <Card className="h-100 shadow-sm">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={product.image || "https://placehold.co/300x200"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from wishlist"
                >
                  <HeartFill />
                </Button>
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{product.name}</Card.Title>

                <div className="mb-2">
                  {renderStars(product.ratings || 0)}
                  <small className="text-muted ms-2">
                    ({product.ratings || 0})
                  </small>
                </div>

                <Card.Text className="text-success fw-bold mb-3">
                  ${(product.price || 0).toFixed(2)}
                </Card.Text>

                <div className="mt-auto d-grid gap-2">
                  {isInCart(product._id) ? (
                    <Button variant="success" disabled>
                      <Cart className="me-2" />
                      Already in Cart
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <Cart className="me-2" />
                      Add to Cart
                    </Button>
                  )}

                  <Button
                    variant="outline-secondary"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WishlistPage;
