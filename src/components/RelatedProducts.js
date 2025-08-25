import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track image loading errors
  const navigate = useNavigate();
  const backendUrl = "https://major-project1-backend-xi.vercel.app/api";

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentProduct?.category) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${backendUrl}/products?category=${encodeURIComponent(
            currentProduct.category
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          const filtered = data
            .filter((p) => p._id !== currentProduct._id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct]);

  // Handle image loading errors
  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    return (
      <span className="text-warning">
        {"★".repeat(Math.round(numericRating))}
        {"☆".repeat(5 - Math.round(numericRating))}
      </span>
    );
  };

  if (loading) {
    return (
      <Row className="mt-5">
        <Col className="text-center">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading related products...</span>
        </Col>
      </Row>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Row className="mt-5">
      <Col>
        <h3 className="mb-4">You May Also Like</h3>
        <Row xs={1} md={2} lg={4} className="g-4">
          {relatedProducts.map((product) => (
            <Col key={product._id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={
                    // Use fallback image if there's an error or no image
                    imageErrors[product._id] || !product.image
                      ? "https://placehold.co/300x200?text=No+Image"
                      : product.image
                  }
                  style={{ height: "200px", objectFit: "cover" }}
                  onClick={() => navigate(`/products/${product._id}`)}
                  role="button"
                  alt={product.name}
                  onError={() => handleImageError(product._id)}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h6">{product.name}</Card.Title>
                  <div className="mb-2">
                    {renderStars(product.ratings || 0)}
                    <small className="text-muted ms-2">
                      ({product.ratings || 0})
                    </small>
                  </div>
                  <Card.Text className="text-success fw-bold mb-3">
                    ${product.price?.toFixed(2) || "0.00"}
                  </Card.Text>
                  <div className="mt-auto d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default RelatedProducts;