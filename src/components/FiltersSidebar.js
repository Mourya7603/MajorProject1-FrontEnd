// components/FiltersSidebar.jsx
import { Card, Form, Button } from "react-bootstrap";

const FiltersSidebar = ({
  categories,
  categoryFilter,
  ratingFilter,
  sortFilter,
  handleCategoryChange,
  handleRatingChange,
  handleSortChange,
  clearFilters,
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filters</h5>
          <Button variant="link" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Category Filter */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Categories</Form.Label>
          <Form.Check
            type="radio"
            id="category-all"
            label="All Categories"
            name="category"
            checked={!categoryFilter}
            onChange={() => handleCategoryChange("")}
            className="mb-2"
          />
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <Form.Check
                key={category._id}
                type="radio"
                id={`category-${category._id}`}
                label={category.name}
                name="category"
                checked={categoryFilter === category.name}
                onChange={() => handleCategoryChange(category.name)}
                className="mb-2"
              />
            ))
          ) : (
            <div className="text-muted">No categories available</div>
          )}
        </Form.Group>

        {/* Rating Filter */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">
            Minimum Rating: {ratingFilter ? `${ratingFilter}★` : "Any"}
          </Form.Label>
          <Form.Range
            min="0"
            max="5"
            step="0.5"
            value={ratingFilter || 0}
            onChange={(e) => handleRatingChange(e.target.value)}
          />
          <div className="d-flex justify-content-between">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <small key={num}>{num}★</small>
            ))}
          </div>
        </Form.Group>

        {/* Sort Filter */}
        <Form.Group>
          <Form.Label className="fw-bold">Sort By</Form.Label>
          <Form.Check
            type="radio"
            id="sort-none"
            label="Default"
            name="sort"
            checked={!sortFilter}
            onChange={() => handleSortChange("")}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="sort-low-high"
            label="Price: Low to High"
            name="sort"
            checked={sortFilter === "lowtohigh"}
            onChange={() => handleSortChange("lowtohigh")}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="sort-high-low"
            label="Price: High to Low"
            name="sort"
            checked={sortFilter === "hightolow"}
            onChange={() => handleSortChange("hightolow")}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default FiltersSidebar;
