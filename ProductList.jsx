import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const [setFilteredItems] = useState([]);


  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [priceRange, setPriceRange] = useState("All");
  const [showToast, setShowToast] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const cartRef = useRef(null); // for flying animation

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };


  const handleSearch = () => {
    const filtered = items.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  };


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product, e) => {
    dispatch(addToCart(product));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    const imgRect = e.target.closest(".card").querySelector("img").getBoundingClientRect();
    flyToCart(product.images[0], imgRect.left, imgRect.top);
  };

  const flyToCart = (imageSrc, startX, startY) => {
    const cart = cartRef.current;
    if (!cart) return;

    const cartRect = cart.getBoundingClientRect();
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.position = "fixed";
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.transition = "all 1s ease-in-out";
    img.style.zIndex = "9999";
    img.style.borderRadius = "10px";

    document.body.appendChild(img);

    setTimeout(() => {
      img.style.left = `${cartRect.left}px`;
      img.style.top = `${cartRect.top}px`;
      img.style.width = "0px";
      img.style.height = "0px";
      img.style.opacity = "0.5";
    }, 50);

    setTimeout(() => {
      document.body.removeChild(img);
    }, 1100);
  };

  const handleShowModal = (product) => {
    setModalData(product);
    new window.bootstrap.Modal(document.getElementById("productModal")).show();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const filteredItems = items.filter((item) => {
    const category = item.category.name.toLowerCase();

    const matchesCategory =
      selectedCategory === "Home" ||
      (selectedCategory === "Electronics" && category.includes("electronics")) ||
      (selectedCategory === "Fashion" &&
        (category.includes("clothes") || category.includes("shoes") || category.includes("sandals"))) ||
      (selectedCategory === "Others" &&
        !category.includes("electronics") &&
        !category.includes("clothes") &&
        !category.includes("shoes") &&
        !category.includes("sandals"));

    const price = item.price;
    const matchesPrice =
      priceRange === "All" ||
      (priceRange === "Low" && price < 500) ||
      (priceRange === "Mid" && price >= 500 && price < 1000) ||
      (priceRange === "High" && price >= 1000);

    return matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-danger mb-3" role="status" />
        <strong className="ms-2">Loading...</strong>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {showToast && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-4 shadow"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          ✅ Item added to cart!
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar fixed-top navbar-expand-lg bg-light shadow">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">My Shop</a>

          <div className="collapse navbar-collapse d-flex justify-content-between">
            <ul className="navbar-nav me-auto">
              {["Home", "Electronics", "Fashion", "Others"].map((cat) => (
                <li className="nav-item" key={cat}>
                  <button
                    className={`nav-link btn ${selectedCategory === cat ? "text-primary fw-bold" : ""}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li className="nav-item">
                <Link to="/cart-items" className="nav-link position-relative" ref={cartRef}>
                  Cart <span className="badge bg-danger">{cartItems.length}</span>
                </Link>
              </li>
            </ul>

            {/* 🔍 Search Bar */}
            <form className="d-flex" role="search" onSubmit={(e) => {
              e.preventDefault();
              handleSearch({ allProducts }); // ⬅️ You define this function below
            }}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-dark me-2" type="submit">
                Search
              </button>


              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-outline-success">Signup</Link>
              <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                Logout
              </button>

            </form>
          </div>
        </div>
      </nav>


      {/* Sidebar */}
      <div className="bg-dark text-white rounded p-3 position-fixed"
        style={{ width: "200px", top: "63px", height: "100vh", left: "0" }}>
        <h5>Categories</h5>
        <ul className="nav flex-column mt-3">
          {["Home", "Electronics", "Fashion", "Others"].map((cat) => (
            <li className="nav-item" key={cat}>
              <button className="btn btn-link text-white text-start w-100" onClick={() => handleCategoryClick(cat)}>
                {cat}
              </button>
            </li>
          ))}


          <li className="nav-item mt-3">
            <label className="form-label text-white">Details</label>
            <select

              className="form-select"
              style={{ cursor: "pointer" }}
              
            >
              <option >Order Details </option>

              <option >Order Tracker</option>
              <option >Delivery date</option>
            </select>
          </li>




          {/* Price Filter */}
          <li className="nav-item mt-3">
            <label htmlFor="priceFilter" className="form-label text-white">Price Range</label>
            <select
              id="priceFilter"
              className="form-select"
              style={{ cursor: "pointer" }}
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="All">All Prices</option>
              <option value="Low">Below ₹500</option>
              <option value="Mid">₹500 - ₹1000</option>
              <option value="High">Above ₹1000</option>
            </select>
          </li>
        </ul>
      </div>

      {/* Products */}
      <div
        className="container-fluid"
        style={{ paddingTop: "80px", marginLeft: "200px" }}
      >
        <div className="row">
          {filteredItems.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div
                className="card h-100 shadow-sm product-card"
                style={{ transition: "transform 0.2s" }}
              >
                <img
                  src={product.images[0]}
                  className="card-img-top"
                  alt={product.title}
                  onClick={() => handleShowModal(product)}
                  style={{
                    cursor: "pointer",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{product.title}</h6>
                  <p className="card-text fw-bold">₹{product.price}</p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <i className="bi bi-cart-plus me-1"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="alert alert-warning text-center">
              No products found.
            </div>
          )}
        </div>
      </div>


      {/* Modal */}
      <div className="modal fade" id="productModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          {modalData && (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalData.title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body d-flex gap-4">
                <img src={modalData.images[0]} alt={modalData.title} style={{ width: "40%" }} />
                <div>
                  <p><strong>Price:</strong> ₹{modalData.price}</p>
                  <p><strong>Category:</strong> {modalData.category.name}</p>
                  <p>{modalData.description}</p>
                  <button className="btn btn-success" onClick={() => handleAddToCart(modalData)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover CSS */}
      <style>{`
        .product-card:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
};

export default ProductList;
