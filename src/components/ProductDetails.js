import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  Card,
  Button,
  Badge,
  Col,
} from "react-bootstrap";
import { Heart, HeartFill, Cart, Image } from "react-bootstrap-icons";

const ProductDetails = ({ product }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-warning fs-4">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-warning fs-4" style={{ opacity: 0.6 }}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-warning fs-4">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const isProductInWishlist = isInWishlist(product._id);
  const isProductInCart = isInCart(product._id);

  return (
    <>
      <Col lg={6} className="mb-4">
        <Card className="h-100 shadow-sm">
          <div className="position-relative" style={{ minHeight: "400px" }}>
            {!imageError && product.image ? (
              <Card.Img
                variant="top"
                src={product.image}
                className="img-fluid"
                style={{ 
                  maxHeight: "500px", 
                  objectFit: "contain",
                }}
                alt={product.name}
                onError={handleImageError}
              />
            ) : (
              <div 
                className="d-flex flex-column align-items-center justify-content-center bg-light text-muted h-100 p-3"
              >
                <Image size={48} className="mb-3 text-muted" />
                <h5 className="text-center">Image Not Available</h5>
                <p className="text-center small">
                  No product image found
                </p>
              </div>
            )}
            
            <Button
              variant={isProductInWishlist ? "danger" : "outline-danger"}
              className="position-absolute top-0 end-0 m-3"
              onClick={toggleWishlist}
              aria-label={
                isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              style={{ zIndex: 2 }}
            >
              {isProductInWishlist ? (
                <HeartFill className="fs-4" />
              ) : (
                <Heart className="fs-4" />
              )}
            </Button>
          </div>
        </Card>
      </Col>

      <Col lg={6}>
        <Card className="h-100 border-0">
          <Card.Body>
            <h2 className="mb-3">{product.name}</h2>

            <div className="d-flex align-items-center mb-3">
              {renderStars(product.ratings || 0)}
              <small className="text-muted ms-2">
                ({product.reviewCount || product.ratings || 0} rating)
              </small>
              {product.stock > 0 ? (
                <Badge bg="success" className="ms-3">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge bg="danger" className="ms-3">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h3 className="text-primary mb-4">${product.price.toFixed(2)}</h3>

            <p className="mb-4">{product.description}</p>

            <div className="mb-4">
              <h5>Details</h5>
              <ul className="list-unstyled">
                <li>
                  <strong>Category:</strong> {product.category}
                </li>
                <li>
                  <strong>Brand:</strong> {product.brand || "Unknown"}
                </li>
                <li>
                  <strong>SKU:</strong> {product.sku || "N/A"}
                </li>
                {product.weight && (
                  <li>
                    <strong>Weight:</strong> {product.weight}
                  </li>
                )}
                {product.dimensions && (
                  <li>
                    <strong>Dimensions:</strong> {product.dimensions}
                  </li>
                )}
              </ul>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="me-3">
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  disabled={product.stock > 0 && quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <Button
                variant={isProductInCart ? "success" : "primary"}
                size="lg"
                className="flex-grow-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isProductInCart}
              >
                {isProductInCart ? (
                  <>
                    <Cart className="me-2" />
                    Already in Cart
                  </>
                ) : (
                  <>
                    <Cart className="me-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default ProductDetails;