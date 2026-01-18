//Admin Panel Page Component

//Purpose: Administrative dashboard for managing store inventory and products

// - Provides admin-only interface for product management (CRUD operations)
//- Manages three product types: shop bouquets, occasion products, and build items
//- Allows admins to create, edit, and delete products across all categories
//- Displays current inventory with product details and images
//- Uses modal forms for adding/editing products
//- Fetches all product data from backend APIs
//- Protected by admin authentication (only accessible to admin users)
// - Essential for store owners to maintain and update their product catalog

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../api/config";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { currentUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [occasionProducts, setOccasionProducts] = useState([]);
  const [buildItems, setBuildItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOccasionModal, setShowOccasionModal] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: ""
  });

  const [occasionForm, setOccasionForm] = useState({
    name: "",
    occasion: "",
    price: "",
    image: "",
    description: ""
  });

  const [buildForm, setBuildForm] = useState({
    name: "",
    category: "",
    color: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const productsRes = await fetch(`${API_URL}/api/products`);
      const productsData = await productsRes.json();

      const occasionRes = await fetch(`${API_URL}/api/occasion-products`);
      const occasionData = await occasionRes.json();

      const buildRes = await fetch(`${API_URL}/api/build-items`);
      const buildData = await buildRes.json();

      setProducts(productsData);
      setOccasionProducts(occasionData);
      setBuildItems(buildData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ADD/EDIT SHOP PRODUCT
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    const url = editingProduct 
      ? `${API_URL}/api/products/${editingProduct._id}`
      : `${API_URL}/api/products`;
    
    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productForm)
    });

    const data = await response.json();

    if (editingProduct) {
      setProducts(products.map(p => p._id === editingProduct._id ? data : p));
    } else {
      setProducts([...products, data]);
    }

    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({ name: "", category: "", price: "", image: "", description: "" });
  };

  // ADD/EDIT OCCASION PRODUCT
  const handleSaveOccasion = async (e) => {
    e.preventDefault();
    
    const url = editingProduct 
      ? `${API_URL}/api/occasion-products/${editingProduct._id}`
      : `${API_URL}/api/occasion-products`;
    
    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(occasionForm)
    });

    const data = await response.json();

    if (editingProduct) {
      setOccasionProducts(occasionProducts.map(p => p._id === editingProduct._id ? data : p));
    } else {
      setOccasionProducts([...occasionProducts, data]);
    }

    setShowOccasionModal(false);
    setEditingProduct(null);
    setOccasionForm({ name: "", occasion: "", price: "", image: "", description: "" });
  };

  // ADD/EDIT BUILD ITEM
  const handleSaveBuild = async (e) => {
    e.preventDefault();
    
    const url = editingProduct 
      ? `${API_URL}/api/build-items/${editingProduct._id}`
      : `${API_URL}/api/build-items`;
    
    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildForm)
    });

    const data = await response.json();

    if (editingProduct) {
      setBuildItems(buildItems.map(i => i._id === editingProduct._id ? data : i));
    } else {
      setBuildItems([...buildItems, data]);
    }

    setShowBuildModal(false);
    setEditingProduct(null);
    setBuildForm({ name: "", category: "", color: "", price: "", image: "" });
  };

  // DELETE FUNCTIONS
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p._id !== id));
  };

  const deleteOccasionProduct = async (id) => {
    if (!window.confirm("Delete this occasion product?")) return;
    await fetch(`${API_URL}/api/occasion-products/${id}`, { method: "DELETE" });
    setOccasionProducts(occasionProducts.filter(p => p._id !== id));
  };

  const deleteBuildItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`${API_URL}/api/build-items/${id}`, { method: "DELETE" });
    setBuildItems(buildItems.filter(i => i._id !== id));
  };

  // EDIT FUNCTIONS
  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description || ""
    });
    setShowProductModal(true);
  };

  const editOccasion = (product) => {
    setEditingProduct(product);
    setOccasionForm({
      name: product.name,
      occasion: product.occasion,
      price: product.price,
      image: product.image,
      description: product.description || ""
    });
    setShowOccasionModal(true);
  };

  const editBuild = (item) => {
    setEditingProduct(item);
    setBuildForm({
      name: item.name,
      category: item.category,
      color: item.color,
      price: item.price,
      image: item.image
    });
    setShowBuildModal(true);
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading admin panel...</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Logged in as: <strong>{currentUser?.email}</strong></p>
      </div>

      <div className="admin-content">
        {/* SHOP PRODUCTS */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Shop Products</h2>
            <button className="add-btn" onClick={() => setShowProductModal(true)}>
              + Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>AED {product.price}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editProduct(product)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* OCCASION PRODUCTS */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Occasion Products</h2>
            <button className="add-btn" onClick={() => setShowOccasionModal(true)}>
              + Add Occasion Product
            </button>
          </div>

          {occasionProducts.length === 0 ? (
            <p>No occasion products found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Occasion</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {occasionProducts.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.occasion}</td>
                    <td>AED{product.price}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editOccasion(product)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteOccasionProduct(product._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* BUILD-A-BOUQUET ITEMS */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Build-a-Bouquet Items</h2>
            <button className="add-btn" onClick={() => setShowBuildModal(true)}>
              + Add Build Item
            </button>
          </div>

          {buildItems.length === 0 ? (
            <p>No build items found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.color}</td>
                    <td>AED {item.price}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editBuild(item)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteBuildItem(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* MODALS */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSaveProduct}>
              <input 
                type="text" 
                placeholder="Name" 
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Category" 
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                required 
              />
              <input 
                type="number" 
                placeholder="Price" 
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Image URL" 
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Description" 
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowProductModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOccasionModal && (
        <div className="modal-overlay" onClick={() => setShowOccasionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Edit Occasion Product" : "Add Occasion Product"}</h2>
            <form onSubmit={handleSaveOccasion}>
              <input 
                type="text" 
                placeholder="Name" 
                value={occasionForm.name}
                onChange={(e) => setOccasionForm({...occasionForm, name: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Occasion" 
                value={occasionForm.occasion}
                onChange={(e) => setOccasionForm({...occasionForm, occasion: e.target.value})}
                required 
              />
              <input 
                type="number" 
                placeholder="Price" 
                value={occasionForm.price}
                onChange={(e) => setOccasionForm({...occasionForm, price: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Image URL" 
                value={occasionForm.image}
                onChange={(e) => setOccasionForm({...occasionForm, image: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Description" 
                value={occasionForm.description}
                onChange={(e) => setOccasionForm({...occasionForm, description: e.target.value})}
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowOccasionModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBuildModal && (
        <div className="modal-overlay" onClick={() => setShowBuildModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Edit Build Item" : "Add Build Item"}</h2>
            <form onSubmit={handleSaveBuild}>
              <input 
                type="text" 
                placeholder="Name" 
                value={buildForm.name}
                onChange={(e) => setBuildForm({...buildForm, name: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Category (flowers/greenery/extras)" 
                value={buildForm.category}
                onChange={(e) => setBuildForm({...buildForm, category: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Color" 
                value={buildForm.color}
                onChange={(e) => setBuildForm({...buildForm, color: e.target.value})}
                required 
              />
              <input 
                type="number" 
                placeholder="Price" 
                value={buildForm.price}
                onChange={(e) => setBuildForm({...buildForm, price: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Image URL" 
                value={buildForm.image}
                onChange={(e) => setBuildForm({...buildForm, image: e.target.value})}
                required 
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowBuildModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


