import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Catalogue from './components/Catalogue';
import Cart from './components/Cart';
import CheckoutForm from './components/Checkout';
import Product from './components/Product';
import './App.css';

const App = () => {
  const [cart, setCart] = useState(() => {
    // Solo lee localStorage una vez al iniciar la app
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('Todas');


  // setear la query del filtro de categoría



  useEffect(() => {
    fetch("https://opensheet.elk.sh/1S2XyDil4a8lyqJZVjJmJGWefl3bqRQHqUjBm_MKpWQ0/Hoja1")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item, index) => ({
          id: parseInt(item.ID ?? index),
          name: item.Nombre,
          price: parseFloat(item.Precio),
          images: item.Imagen ? item.Imagen.split(',').map(img => img.trim()) : ['https://via.placeholder.com/150'],
          description: item.Descripcion ?? '',
          category: item.Categoria?.trim() || 'Sin categoría',
          type: item.Tipo?.trim() || '',
          popularity: item.Popularidad ? parseInt(item.Popularidad) : 0,
        }));
        setProducts(formatted);
      })
      .catch(() => setProducts([])); // Manejamos error dejando productos vacíos
  }, []);

  // Sincronizar carrito con localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Métodos que manipulan carrito
  const addToCart = useCallback((product) => {
    setCart((prevCart) => [...prevCart, product]);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  }, []);

  const getProductById = useCallback((id) => {
    return products.find((product) => product.id === parseInt(id));
  }, [products]);

  const ProductPageWrapper = () => {
    const { id } = useParams();
    const product = getProductById(id);
    return product ? <Product product={product} addToCart={addToCart} /> : <div>Producto no encontrado</div>;
  };

  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <NavBar
            cartItemCount={cart.length}
            logoSrc="/SLC.png"
            onFilterCategory={setCategoryFilter} // pasar función para cambiar categoría
          />          <Routes>
            <Route path="/" element={<Catalogue products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} clearCart={clearCart} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutForm cart={cart} clearCart={clearCart} />} />
            <Route path="/product/:id" element={<ProductPageWrapper />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
