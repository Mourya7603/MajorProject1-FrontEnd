// components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { Form, FormControl, Button, InputGroup, Navbar, Nav, Offcanvas } from "react-bootstrap";
import { Search, Person, Heart, Cart } from "react-bootstrap-icons";

const Header = () => {
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { getWishlistCount } = useWishlist();
  const { getCartCount } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

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
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Navigate to product page when selecting a search result
  const handleProductSelect = (productId) => {
    setShowDropdown(false);
    setQ("");
    navigate(`/products/${productId}`);
    setShowOffcanvas(false);
  };

  // Handle search form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      setShowDropdown(false);
      navigate(`/products?search=${encodeURIComponent(q.trim())}`);
      setQ("");
      setShowOffcanvas(false);
    }
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/40x40";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        searchRef.current && 
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-white border-bottom sticky-top py-2">
        <div className="container">
          {/* Brand and Toggle */}
          <div className="d-flex align-items-center w-100">
            <Navbar.Brand as={Link} to="/" className="fw-bold me-auto">
              MyShoppingSite
            </Navbar.Brand>
            
            {/* Desktop Navigation Icons */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              <Link to="/profile" className="text-dark mx-2" aria-label="Profile">
                <Person size={20} />
              </Link>
              <Link to="/wishlist" className="text-dark position-relative mx-2" aria-label="Wishlist">
                <Heart size={20} />
                {getWishlistCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill" style={{fontSize: '0.6rem'}}>
                    {getWishlistCount() > 99 ? '99+' : getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="text-dark position-relative mx-2" aria-label="Cart">
                <Cart size={20} />
                {getCartCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge bg-primary rounded-pill" style={{fontSize: '0.6rem'}}>
                    {getCartCount() > 99 ? '99+' : getCartCount()}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Mobile Toggle Button */}
            <Navbar.Toggle 
              aria-controls="offcanvasNavbar" 
              onClick={() => setShowOffcanvas(true)}
              className="border-0 ms-2"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </Navbar.Toggle>
          </div>

          {/* Search Bar - Visible on all screens */}
          <div className="w-100 mt-2 mt-lg-0 position-relative" ref={searchRef}>
            <Form onSubmit={onSubmit}>
              <InputGroup>
                <FormControl
                  type="search"
                  placeholder="Search products..."
                  value={q}
                  onChange={handleSearchChange}
                  aria-label="Search products"
                  onClick={(e) => e.stopPropagation()}
                  className="py-2"
                  aria-expanded={showDropdown}
                  aria-haspopup="listbox"
                  aria-controls="search-results-list"
                />
                <Button 
                  type="submit" 
                  variant="outline-primary" 
                  className="py-2"
                  aria-label="Search"
                >
                  <Search />
                </Button>
              </InputGroup>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="position-absolute w-100 mt-1 shadow-sm bg-white rounded border"
                  style={{ zIndex: 1000 }}
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  id="search-results-list"
                  aria-label="Search results"
                >
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="p-2 border-bottom d-flex align-items-center"
                      style={{ 
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                      onClick={() => handleProductSelect(product._id)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                      role="option"
                      aria-selected="false"
                    >
                      <img
                        src={product.image || "https://placehold.co/40x40"}
                        alt={product.name}
                        onError={handleImageError}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <div className="fw-bold text-truncate" style={{maxWidth: '200px'}}>
                          {product.name}
                        </div>
                        <div className="text-muted small">${product.price}</div>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 text-center bg-light">
                    <Button 
                      variant="link" 
                      onClick={onSubmit} 
                      className="p-0 text-decoration-none"
                    >
                      View all results for "{q}"
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>

          {/* Offcanvas Menu for Mobile */}
          <Offcanvas
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            placement="end"
            className="w-75"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  onClick={() => setShowOffcanvas(false)}
                  className="d-flex align-items-center py-3 border-bottom"
                >
                  <Person className="me-2" size={20} />
                  Profile
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/wishlist" 
                  onClick={() => setShowOffcanvas(false)}
                  className="d-flex align-items-center py-3 border-bottom position-relative"
                >
                  <Heart className="me-2" size={20} />
                  Wishlist
                  {getWishlistCount() > 0 && (
                    <span className="position-absolute end-0 badge bg-danger rounded-pill me-2" style={{fontSize: '0.6rem'}}>
                      {getWishlistCount() > 99 ? '99+' : getWishlistCount()}
                    </span>
                  )}
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/cart" 
                  onClick={() => setShowOffcanvas(false)}
                  className="d-flex align-items-center py-3 border-bottom position-relative"
                >
                  <Cart className="me-2" size={20} />
                  Cart
                  {getCartCount() > 0 && (
                    <span className="position-absolute end-0 badge bg-primary rounded-pill me-2" style={{fontSize: '0.6rem'}}>
                      {getCartCount() > 99 ? '99+' : getCartCount()}
                    </span>
                  )}
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Navbar>
    </>
  );
};

export default Header;