import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import {
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";
import ProductCard from "../components/ProductCard";
import FiltersSidebar from "../components/FiltersSidebar";

const ProductListingPage = () => {
  const {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Get current filters from URL
  const ratingFilter = searchParams.get("rating") || "";
  const sortFilter = searchParams.get("sort") || "";
  const searchFilter = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const arrivalsFilter = searchParams.get("arrivals") || ""; // NEW: Get arrivals filter

  // Apply filters when URL params change (for search, category, and arrivals)
  useEffect(() => {
    const params = {};
    if (searchFilter) params.search = searchFilter;
    if (categoryFilter) params.category = categoryFilter;
    if (arrivalsFilter) params.arrivals = arrivalsFilter; // NEW: Add arrivals to params

    fetchProducts(params);
  }, [searchFilter, categoryFilter, arrivalsFilter]); // NEW: Add arrivalsFilter dependency

  // Load categories if not already loaded
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      loadCategories();
    }
  }, [categories.length, categoriesLoading]);

  // Set initial category filter from URL when component mounts
  useEffect(() => {
    if (categoryFilter && categories.length > 0) {
      // Split category filter by comma if multiple categories are specified
      const categoriesFromURL = categoryFilter.split(",");

      // Check if categories exist in our categories list
      const validCategories = categoriesFromURL.filter((catName) =>
        categories.some((cat) => cat.name === catName)
      );

      if (validCategories.length > 0) {
        setSelectedCategories(validCategories);
      }
    }
  }, [categoryFilter, categories]);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      await fetchCategories(); // CHANGED: Use fetchCategories instead of refetchCategories
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Apply client-side filtering for categories, rating, and sorting
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      // Filter by multiple categories (client-side)
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((product) =>
          selectedCategories.includes(product.category)
        );
      }

      // Filter by rating (client-side)
      if (ratingFilter) {
        const minRating = parseFloat(ratingFilter);
        filtered = filtered.filter(
          (product) => (product.ratings || 0) >= minRating
        );
      }

      // Sort products (client-side)
      if (sortFilter === "lowtohigh") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortFilter === "hightolow") {
        filtered.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, selectedCategories, ratingFilter, sortFilter]);

  const handleCategoryChange = (categoriesArray) => {
    setSelectedCategories(categoriesArray);

    // Update URL with all selected categories or remove category param if empty
    const newParams = new URLSearchParams(searchParams);
    if (categoriesArray.length > 0) {
      // Join multiple categories with commas
      newParams.set("category", categoriesArray.join(","));
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
    setSelectedCategories([]);
    const newParams = new URLSearchParams();
    if (searchFilter) newParams.set("search", searchFilter);
    if (arrivalsFilter) newParams.set("arrivals", arrivalsFilter); // NEW: Keep arrivals filter if present
    setSearchParams(newParams);
  };

  const handleRefreshCategories = async () => {
    await loadCategories();
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
            selectedCategories={selectedCategories}
            ratingFilter={ratingFilter}
            sortFilter={sortFilter}
            onCategoryChange={handleCategoryChange}
            onRatingChange={handleRatingChange}
            onSortChange={handleSortChange}
            onClearFilters={clearFilters}
            onRefreshCategories={handleRefreshCategories}
            categoriesLoading={categoriesLoading}
          />
        </Col>

        {/* Products Listing */}
        <Col md={9}>
          {/* Page Header with Filter Info */}
          <div className="mb-4">
            <h2>
              {arrivalsFilter // NEW: Show arrivals filter first
                ? `${arrivalsFilter} Collection`
                : selectedCategories.length > 0
                ? `Products in ${selectedCategories.join(", ")}`
                : searchFilter
                ? `Search Results for "${searchFilter}"`
                : "All Products"}
            </h2>

            {(selectedCategories.length > 0 || ratingFilter || sortFilter || arrivalsFilter) && ( // NEW: Added arrivalsFilter
              <div className="d-flex flex-wrap gap-2 mt-2">
                {arrivalsFilter && ( // NEW: Show arrivals badge
                  <Badge bg="warning" className="fs-6">
                    Collection: {arrivalsFilter}
                  </Badge>
                )}
                {selectedCategories.length > 0 && (
                  <Badge bg="primary" className="fs-6">
                    {selectedCategories.length} Category
                    {selectedCategories.length > 1 ? "s" : ""}
                  </Badge>
                )}
                {ratingFilter && (
                  <Badge bg="info" className="fs-6">
                    Rating: {ratingFilter}★+
                  </Badge>
                )}
                {sortFilter && (
                  <Badge bg="secondary" className="fs-6">
                    Sorted:{" "}
                    {sortFilter === "lowtohigh" ? "Low to High" : "High to Low"}
                  </Badge>
                )}
                <Badge bg="success" className="fs-6">
                  {filteredProducts.length} Product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <Alert variant="info">
                  No products found matching your filters.
                  <div className="mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </Alert>
              ) : (
                <Row xs={1} sm={2} lg={3} className="g-4">
                  {filteredProducts.map((product) => (
                    <Col key={product._id}>
                      <ProductCard
                        product={product}
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