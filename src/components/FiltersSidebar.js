// components/FiltersSidebar.jsx
import { Card, Form, Button, Badge, Spinner, Alert } from "react-bootstrap";

const FiltersSidebar = ({
  categories = [],
  selectedCategories = [],
  ratingFilter = "",
  sortFilter = "",
  onCategoryChange = () => {},
  onRatingChange = () => {},
  onSortChange = () => {},
  onClearFilters = () => {},
  categoriesLoading = false,
}) => {
  const handleCategoryCheckboxChange = (categoryName, isChecked) => {
    let updatedCategories;

    if (isChecked) {
      // Add category to filter
      updatedCategories = [...selectedCategories, categoryName];
    } else {
      // Remove category from filter
      updatedCategories = selectedCategories.filter(
        (cat) => cat !== categoryName
      );
    }

    onCategoryChange(updatedCategories);
  };

  const handleSelectAll = () => {
    // Select all category names
    const allCategories = categories.map((cat) => cat.name);
    onCategoryChange(allCategories);
  };

  const handleClearCategories = () => {
    onCategoryChange([]);
  };

  // Extract category names if categories are objects with name property
  const getCategoryName = (category) => {
    return typeof category === "string" ? category : category.name;
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filters</h5>
          <Button variant="link" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Category Filter with Checkboxes */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold d-flex justify-content-between align-items-center">
            <span>Categories</span>
            {selectedCategories.length > 0 && (
              <Badge bg="primary" pill>
                {selectedCategories.length}
              </Badge>
            )}
          </Form.Label>

          {categoriesLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Loading categories...</span>
            </div>
          ) : categories && categories.length > 0 ? (
            <>
              {/* Select All / Clear buttons */}
              <div className="d-flex gap-2 mb-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={selectedCategories.length === categories.length}
                >
                  Select All
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleClearCategories}
                  disabled={selectedCategories.length === 0}
                >
                  Clear
                </Button>
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {categories.map((category) => {
                  const categoryName = getCategoryName(category);
                  return (
                    <Form.Check
                      key={category._id || category.id || categoryName}
                      type="checkbox"
                      id={`category-${
                        category._id || category.id || categoryName
                      }`}
                      label={categoryName}
                      name="category"
                      checked={selectedCategories.includes(categoryName)}
                      onChange={(e) =>
                        handleCategoryCheckboxChange(
                          categoryName,
                          e.target.checked
                        )
                      }
                      className="mb-2"
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <Alert variant="info" className="text-center py-2">
              No categories available
            </Alert>
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
            onChange={(e) => onRatingChange(e.target.value)}
            className="mb-2"
          />
          <div className="d-flex justify-content-between">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <small
                key={num}
                className={
                  parseFloat(ratingFilter || 0) >= num
                    ? "text-primary fw-bold"
                    : "text-muted"
                }
                style={{ cursor: "pointer" }}
                onClick={() => onRatingChange(num.toString())}
              >
                {num}★
              </small>
            ))}
          </div>
          <div className="text-center mt-1">
            <Button
              variant="link"
              size="sm"
              onClick={() => onRatingChange("")}
              disabled={!ratingFilter}
            >
              Clear rating
            </Button>
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
            onChange={() => onSortChange("")}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="sort-low-high"
            label="Price: Low to High"
            name="sort"
            checked={sortFilter === "lowtohigh"}
            onChange={() => onSortChange("lowtohigh")}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="sort-high-low"
            label="Price: High to Low"
            name="sort"
            checked={sortFilter === "hightolow"}
            onChange={() => onSortChange("hightolow")}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default FiltersSidebar;