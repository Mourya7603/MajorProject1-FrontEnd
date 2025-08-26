import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  Card,
  Button,
  Badge,
  Col,
  Row,
} from "react-bootstrap";
import { Heart, HeartFill, Cart } from "react-bootstrap-icons";

const ProductDetails = ({ product }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState(null);

  // Define available shades for lipstick products
  const lipstickShades = [
    { id: 1, name: "Ruby Red", value: "#E0115F" },
    { id: 2, name: "Coral Bliss", value: "#FF7F50" },
    { id: 3, name: "Pink Petal", value: "#F6C0D0" },
    { id: 4, name: "Mauve", value: "#873D48" },
    { id: 5, name: "Nude", value: "#E6C9A8" },
    { id: 6, name: "Berry Bold", value: "#991F36" },
  ];

  // Set default shade when component mounts
  useEffect(() => {
    if (product.category === "Beauty" && lipstickShades.length > 0) {
      setSelectedShade(lipstickShades[0]);
    }
  }, [product.category]);

  const toggleWishlist = () => {
    // Include selected shade info if applicable
    const productWithShade =
      product.category === "Beauty" && selectedShade
        ? { ...product, selectedShade }
        : product;

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productWithShade);
    }
  };

  const handleAddToCart = () => {
    // Include selected shade info if applicable
    const productWithShade =
      product.category === "Beauty" && selectedShade
        ? { ...product, selectedShade }
        : product;

    addToCart(productWithShade, quantity);
  };

  const handleBuyNow = () => {
    // Include selected shade info if applicable
    const productWithShade =
      product.category === "Beauty" && selectedShade
        ? { ...product, selectedShade }
        : product;

    addToCart(productWithShade, quantity);
    navigate("/cart");
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
          <div className="position-relative">
            <Card.Img
              variant="top"
              src={product.image || "https://placehold.co/600x400"}
              className="img-fluid"
              style={{ maxHeight: "500px", objectFit: "contain" }}
              alt={product.name}
            />
            <Button
              variant={isProductInWishlist ? "danger" : "outline-danger"}
              className="position-absolute top-0 end-0 m-3"
              onClick={toggleWishlist}
              aria-label={
                isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
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
                ({product.reviewCount || product.ratings || 0} reviews)
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

            {/* Shade Selector for Lipstick Products */}
            {product.category === "Beauty" && (
              <div className="mb-4">
                <h5>Select Shade</h5>
                <div className="mb-2">
                  <small className="text-muted">
                    Selected: {selectedShade ? selectedShade.name : "None"}
                  </small>
                </div>
                <Row className="g-2">
                  {lipstickShades.map((shade) => (
                    <Col xs={4} sm={3} md={2} key={shade.id}>
                      <div
                        className={`shade-option p-2 rounded ${
                          selectedShade?.id === shade.id ? "selected-shade" : ""
                        }`}
                        onClick={() => setSelectedShade(shade)}
                        style={{
                          cursor: "pointer",
                          border:
                            selectedShade?.id === shade.id
                              ? "2px solid #0d6efd"
                              : "1px solid #dee2e6",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <div
                          className="mx-auto rounded-circle"
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: shade.value,
                            border: "1px solid #ccc",
                          }}
                        ></div>
                        <small className="d-block text-center mt-1">
                          {shade.name}
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

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

            {/* Quantity Selector and Add to Cart Button */}
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">Quantity:</span>
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
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-3">
              <Button
                variant={isProductInCart ? "success" : "primary"}
                size="lg"
                className="w-100"
                onClick={handleAddToCart}
                disabled={
                  product.stock === 0 ||
                  isProductInCart ||
                  (product.category === "Beauty" && !selectedShade)
                }
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

            {/* Buy Now Button */}
            <div className="mb-3">
              <Button
                variant="outline-primary"
                size="lg"
                className="w-100"
                onClick={handleBuyNow}
                disabled={
                  product.stock === 0 ||
                  (product.category === "Beauty" && !selectedShade)
                }
              >
                Buy Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <style>{`
        .shade-option:hover {
          transform: scale(1.05);
          transition: transform 0.2s;
        }
        .selected-shade {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </>
  );
};

export default ProductDetails;