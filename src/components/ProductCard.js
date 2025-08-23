// components/ProductCard.js
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart } = useCart();

  const inWishlist = isInWishlist(product._id);
  const inCart = isInCart(product._id);

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={16} fill="#FFD700" color="#FFD700" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={16}
          fill="#FFD700"
          color="#FFD700"
          style={{ opacity: 0.7 }}
        />
      );
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} fill="none" color="#FFD700" />
      );
    }

    return stars;
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  };

  return (
    <Card className="h-100 shadow-sm position-relative">
      {/* Heart Button on Image */}
      <div
        onClick={handleWishlistToggle}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        <Heart
          size={24}
          color={inWishlist ? "red" : "gray"}
          fill={inWishlist ? "red" : "transparent"}
        />
      </div>

      {/* Product Image */}
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.name}
        onClick={() => navigate(`/products/${product._id}`)}
        style={{ cursor: "pointer", height: "200px", objectFit: "cover" }}
      />

      {/* Card Body */}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{product.name}</Card.Title>

        {/* Rating Display */}
        <div className="d-flex align-items-center mb-2">
          <div className="me-2">{renderRating(product.ratings || 0)}</div>
          <span className="text-muted small">
            {product.ratings ? product.ratings.toFixed(1) : "0.0"}
          </span>
          {product.numReviews && (
            <span className="text-muted small ms-1">
              ({product.numReviews})
            </span>
          )}
        </div>

        <Card.Text className="fw-bold text-primary mb-3">
          ${product.price}
        </Card.Text>

        {/* Add to Cart Button */}
        <Button
          variant={inCart ? "outline-danger" : "primary"}
          className="mt-auto"
          onClick={handleCartToggle}
        >
          {inCart ? "Remove from Cart" : "Add to Cart"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
