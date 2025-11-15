import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", quantity: "" });
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      };
      await axios.post("/api/products", payload);
      setForm({ name: "", description: "", price: "", quantity: "" });
      loadProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 fw-bold text-primary">🛒 PrimeMart</h1>

      <div className="row g-4">

        {/* Add Product Section */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Add New Product</h5>
              <form onSubmit={addProduct}>
                <input
                  className="form-control mb-3"
                  placeholder="Product Name"
                  name="name"
                  value={form.name}
                  required
                  onChange={onChange}
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Description"
                  rows="2"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                ></textarea>
                <input
                  className="form-control mb-3"
                  placeholder="Price (₹)"
                  name="price"
                  required
                  value={form.price}
                  onChange={onChange}
                />
                <input
                  className="form-control mb-3"
                  placeholder="Quantity"
                  name="quantity"
                  required
                  value={form.quantity}
                  onChange={onChange}
                />
                <button className="btn btn-primary w-100">Add Product</button>
              </form>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Available Products</h5>

              {loading ? (
                <p>Loading...</p>
              ) : products.length === 0 ? (
                <p>No products available.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price (₹)</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.price}</td>
                          <td>{p.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
