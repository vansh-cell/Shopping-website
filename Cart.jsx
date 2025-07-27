import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
// import "bootstrap-icons/font/bootstrap-icons.css";


const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alertVisible, setAlertVisible] = useState(false);

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearAll = () => {
    if (items.length === 0) {
      // 🟥 Show alert for empty cart
      alert("❌ No items to clear!");
      return;
    }

    dispatch(clearCart());
    localStorage.removeItem("cartItems");
    setAlertVisible(true);

    setTimeout(() => setAlertVisible(false), 3000); // Hide after 3 sec
  };

  return (
    <div className="container my-4">
      {/* ✅ Custom Bootstrap Alert */}
      {alertVisible && (
        <div className="alert alert-success alert-dismissible fade show text-center" role="alert">
          🛒 Cart cleared successfully!
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertVisible(false)}
          ></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold me-5">My Cart</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <button className="btn btn-outline-secondary" onClick={clearAll}>
            <i className="bi bi-trash"></i> Clear All
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="alert alert-danger text-center" role="alert">
          No items in cart.
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="card mb-3 shadow-sm">
            <div className="row g-0">
              <div className="col-md-2 d-flex align-items-center justify-content-center">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="img-fluid p-1 rounded-start"
                  style={{ maxHeight: "100px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-7">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <div className="mb-2 text-warning">
                    {"⭐".repeat(Math.floor(item.rating || Math.random() * 2 + 4))}
                  </div>
                  <p className="card-text text-muted">
                    ${item.price} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="col-md-3 d-flex align-items-center justify-content-center">
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => dispatch(decreaseQty(item.id))}
                  >
                    -
                  </button>
                  <span className="btn btn-outline-dark">{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => dispatch(increaseQty(item.id))}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-outline-danger ms-3"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {items.length > 0 && (
        <div className="text-end mt-4">
          <h4 className="fw-semibold">Total: ${calculateTotal().toFixed(2)}</h4>
        </div>
      )}
    </div>
  );
};

export default Cart;
