import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Default categories as fallback
  const defaultCategories = [
    { _id: "1", name: "Electronics", image: null },
    { _id: "2", name: "Clothing", image: null },
    { _id: "3", name: "Books", image: null },
    { _id: "4", name: "Home & Garden", image: null },
    { _id: "5", name: "Sports", image: null },
    { _id: "6", name: "Beauty", image: null },
  ];

  // Mock new arrivals data
  const newArrivals = [
    { id: 1, name: "Summer Collection", desc: "Fresh styles for the season" },
    { id: 2, name: "Winter Specials", desc: "Cozy winter essentials" },
    { id: 3, name: "Limited Edition", desc: "Exclusive items" },
    { id: 4, name: "Bestsellers", desc: "Customer favorites" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test if backend is reachable first
        console.log("Testing backend connection...");

        const response = await fetch(
          "https://major-project1-backend-xi.vercel.app/api/categories",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Handle different response formats
        let categoriesArray = [];

        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data.categories && Array.isArray(data.categories)) {
          categoriesArray = data.categories;
        } else if (data.data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else {
          console.warn("Unexpected API format, using default categories");
          categoriesArray = defaultCategories;
        }

        setCats(categoriesArray);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(err.message);
        // Use default categories as fallback
        setCats(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleNewArrivalClick = (arrivalId) => {
    navigate(`/products?new=${arrivalId}`);
  };

  return (
    <div className="container py-4">
      {/* Categories Section - Top */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Shop Categories</h4>
          {error && (
            <small className="text-warning">
              <i className="bi bi-exclamation-triangle"></i> Using demo data
            </small>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading categories...</span>
            </div>
            <p className="mt-2 text-muted">Loading categories...</p>
          </div>
        ) : (
          <div className="row g-3">
            {cats.map((c) => (
              <div className="col-6 col-md-3 col-lg-2" key={c._id || c.id}>
                <button
                  className="btn p-0 w-100 border-0 bg-transparent"
                  onClick={() => handleCategoryClick(c.name)}
                  aria-label={`Browse ${c.name} category`}
                >
                  <div className="card h-100 text-center hover-shadow">
                    <img
                      src={
                        c.image ||
                        `https://placehold.co/500x500/4a6cf7/ffffff?text=${encodeURIComponent(
                          c.name
                        )}`
                      }
                      className="card-img-top object-fit-cover"
                      alt={c.name}
                      style={{ height: "100px" }}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/500x500/4a6cf7/ffffff?text=${encodeURIComponent(
                          c.name
                        )}`;
                      }}
                    />
                    <div className="card-body p-2">
                      <small className="text-dark fw-bold">{c.name}</small>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner - Middle */}
      <div className="my-5">
        <div className="bg-primary text-white rounded-3 p-5 text-center">
          <h2 className="mb-3">🌟 Special Promotion 🌟</h2>
          <p className="lead mb-4">Get up to 50% off on your first order!</p>
          <button
            className="btn btn-light btn-lg"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* New Arrivals Section - Bottom */}
      <div className="mt-5">
        <h4 className="mb-3">New Arrivals</h4>
        <div className="row g-4">
          {newArrivals.map((item) => (
            <div className="col-6 col-md-3" key={item.id}>
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <img
                  src={`https://placehold.co/500x500/6f42c1/ffffff?text=${encodeURIComponent(
                    item.name
                  )}`}
                  className="card-img-top object-fit-cover"
                  alt={item.name}
                  style={{ height: "200px" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted small">{item.desc}</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleNewArrivalClick(item.id)}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5 pt-4">
        <div className="col-md-4 text-center">
          <div className="bg-light rounded-3 p-4">
            <i className="bi bi-truck fs-1 text-primary mb-3"></i>
            <h5>Free Shipping</h5>
            <p className="text-muted">On orders over $50</p>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-light rounded-3 p-4">
            <i className="bi bi-arrow-left-right fs-1 text-primary mb-3"></i>
            <h5>Easy Returns</h5>
            <p className="text-muted">30-day return policy</p>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="bg-light rounded-3 p-4">
            <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
            <h5>Secure Payment</h5>
            <p className="text-muted">Safe and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
