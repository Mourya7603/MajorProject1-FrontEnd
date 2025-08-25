// components/ProductCard.js (Simplified)
import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Heart, Star, ImageOff } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const inWishlist = isInWishlist(product._id);
  const inCart = isInCart(product._id);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Function to render star ratings
  const renderRating = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? "#FFD700" : "none"}
        color="#FFD700"
        style={{
          opacity: index < rating && index >= Math.floor(rating) ? 0.7 : 1,
        }}
      />
    ));
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCartToggle = (e) => {
    e.stopPropagation();
    if (inCart) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <Card className="h-100 shadow-sm position-relative product-card">
      {/* Heart Button on Image */}
      <div
        onClick={handleWishlistToggle}
        className="position-absolute top-0 end-0 m-2 p-1 bg-white rounded-circle"
        style={{ cursor: "pointer", zIndex: 2 }}
      >
        <Heart
          size={20}
          color={inWishlist ? "red" : "gray"}
          fill={inWishlist ? "red" : "transparent"}
        />
      </div>

      {/* Product Image with Fallback */}
      <div
        className="position-relative"
        style={{ height: "200px", overflow: "hidden", cursor: "pointer" }}
        onClick={handleCardClick}
      >
        {!imageError && product.image ? (
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            style={{
              height: "200px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center bg-light text-muted h-100">
            <ImageOff size={40} className="mb-2" />
            <span className="small">Image not available</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <Card.Body className="d-flex flex-column">
        <Card.Title
          className="h6 text-truncate"
          title={product.name}
          style={{ cursor: "pointer" }}
          onClick={handleCardClick}
        >
          {product.name}
        </Card.Title>

        {/* Rating Display */}
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">{renderRating(product.ratings || 0)}</div>
          <span className="text-muted small">
            ({product.ratings ? product.ratings.toFixed(1) : "0.0"})
          </span>
        </div>

        <Card.Text className="fw-bold text-primary mb-3">
          ${product.price}
        </Card.Text>

        {/* Add to Cart Button */}
        <Button
          variant={inCart ? "outline-danger" : "primary"}
          className="mt-auto"
          onClick={handleCartToggle}
          size="sm"
        >
          {inCart ? "Remove from Cart" : "Add to Cart"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
