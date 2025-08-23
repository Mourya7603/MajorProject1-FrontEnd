// components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const Header = () => {
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { getWishlistCount } = useWishlist();
  const { getCartCount } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQ(value);

    if (value.trim()) {
      // Filter products based on search term
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results.slice(0, 5)); // Show max 5 results
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Navigate to product page when selecting a search result
  const handleProductSelect = (productId) => {
    setShowDropdown(false);
    setQ("");
    navigate(`/products/${productId}`);
  };

  // Handle search form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      setShowDropdown(false);
      navigate(`/products?search=${q.trim()}`);
      setQ("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          MyShoppingSite
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <Form
            className="d-flex ms-auto me-3 w-50 position-relative"
            onSubmit={onSubmit}
          >
            <InputGroup>
              <FormControl
                type="search"
                placeholder="Search products..."
                value={q}
                onChange={handleSearchChange}
                aria-label="Search products"
                onClick={(e) => e.stopPropagation()}
              />
              <Button type="submit" variant="outline-primary">
                <Search />
              </Button>
            </InputGroup>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div
                className="position-absolute w-100 mt-1 shadow-sm bg-white rounded border"
                style={{ zIndex: 1000, top: "100%" }}
                onClick={(e) => e.stopPropagation()}
              >
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="p-2 border-bottom hover-bg-light d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleProductSelect(product._id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <div className="fw-bold">{product.name}</div>
                      <div className="text-muted small">${product.price}</div>
                    </div>
                  </div>
                ))}
                <div className="p-2 text-center text-primary">
                  <Button variant="link" onClick={onSubmit}>
                    View all results
                  </Button>
                </div>
              </div>
            )}
          </Form>

          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/wishlist">
                ❤ Wishlist
              </Link>
              {getWishlistCount() > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {getWishlistCount()}
                </span>
              )}
            </li>
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/cart">
                🛒 Cart
              </Link>
              {getCartCount() > 0 && (
                <span className="badge bg-primary position-absolute top-0 start-100 translate-middle">
                  {getCartCount()}
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
