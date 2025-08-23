import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { Container, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";
import ProductCard from "../components/ProductCard";
import FiltersSidebar from "../components/FiltersSidebar";

const ProductListingPage = () => {
  const { products, categories, loading, error, fetchProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortedProducts, setSortedProducts] = useState([]);

  // Get current filters from URL
  const categoryFilter = searchParams.get("category") || "";
  const ratingFilter = searchParams.get("rating") || "";
  const sortFilter = searchParams.get("sort") || "";
  const searchFilter = searchParams.get("search") || "";

  // Apply filters when URL params change
  useEffect(() => {
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    if (ratingFilter) params.rating = parseFloat(ratingFilter);
    if (sortFilter) params.sort = sortFilter;
    if (searchFilter) params.search = searchFilter;

    fetchProducts(params);
  }, [searchParams]);

  // Sort products with selected category first
  useEffect(() => {
    if (products.length > 0 && categoryFilter) {
      const sorted = [...products].sort((a, b) => {
        // Products in the selected category come first
        const aInCategory = a.category === categoryFilter;
        const bInCategory = b.category === categoryFilter;

        if (aInCategory && !bInCategory) return -1;
        if (!aInCategory && bInCategory) return 1;

        // If both are in same category, apply price sorting
        if (sortFilter === "lowtohigh") {
          return a.price - b.price;
        } else if (sortFilter === "hightolow") {
          return b.price - a.price;
        }

        return 0;
      });
      setSortedProducts(sorted);
    } else {
      setSortedProducts(products);
    }
  }, [products, categoryFilter, sortFilter]);

  const handleCategoryChange = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName) {
      newParams.set("category", categoryName);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleRatingChange = (rating) => {
    const newParams = new URLSearchParams(searchParams);
    if (rating && rating > 0) {
      newParams.set("rating", rating);
    } else {
      newParams.delete("rating");
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sortType) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortType) {
      newParams.set("sort", sortType);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarFill key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarFill key={i} className="text-warning" style={{ opacity: 0.6 }} />
        );
      } else {
        stars.push(<Star key={i} className="text-warning" />);
      }
    }
    return stars;
  };

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        {/* Filters Sidebar */}
        <Col md={3} className="mb-4">
          <FiltersSidebar
            categories={categories}
            categoryFilter={categoryFilter}
            ratingFilter={ratingFilter}
            sortFilter={sortFilter}
            handleCategoryChange={handleCategoryChange}
            handleRatingChange={handleRatingChange}
            handleSortChange={handleSortChange}
            clearFilters={clearFilters}
          />
        </Col>

        {/* Products Listing */}
        <Col md={9}>
          {/* Category Header */}
          {categoryFilter && (
            <div className="mb-4">
              <h4>Category: {categoryFilter}</h4>
              <Badge bg="primary" className="fs-6">
                Showing{" "}
                {
                  sortedProducts.filter((p) => p.category === categoryFilter)
                    .length
                }{" "}
                items in this category
              </Badge>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {sortedProducts.length === 0 ? (
                <Alert variant="info">
                  No products found matching your filters.
                </Alert>
              ) : (
                <Row xs={1} sm={2} lg={3} className="g-4">
                  {sortedProducts.map((product) => (
                    <Col key={product._id}>
                      <ProductCard
                        product={product}
                        categoryFilter={categoryFilter}
                        renderStars={renderStars}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListingPage;
