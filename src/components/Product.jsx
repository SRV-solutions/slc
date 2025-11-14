import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Product = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [customText, setCustomText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const sizedTypes = ['Remera', 'shoShortrt', 'Campera', 'Conjunto deportivo', 'Conjunto'];

  const sizeOptions = sizedTypes.includes(product.type)
    ? ['2', '4', '6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Personalizado']
    : [];

  const handleAddToCart = () => {
    if (sizeOptions.length > 0 && size === '') {
      alert('Por favor, seleccioná un talle.');
      return;
    }

    const productWithDetails = {
      ...product,
      quantity,
      size: size === 'Personalizado' ? customText : size || undefined,
    };
    addToCart(productWithDetails);
    setSnackbarOpen(snackbarOpen);
    
    // Elimina alert para evitar bloqueo visual de Snackbar
    // alert('Producto añadido al carrito correctamente.');
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
    if (e.target.value !== 'Personalizado') setCustomText('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
    console.log(snackbarOpen);

  return (
    <>
      <Card sx={{ maxWidth: 450, margin: '20px auto', padding: 2, boxShadow: 3, borderRadius: 3 }}>
        <Carousel
          showThumbs={false}
          infiniteLoop
          useKeyboardArrows
          autoPlay={false}
          dynamicHeight={false}
          emulateTouch
          showStatus={false}
        >
          {product.images.length > 0 ? (
            product.images.map((img, i) => (
              <CardMedia
                key={i}
                component="img"
                image={img}
                alt={`${product.name} imagen ${i + 1}`}
                sx={{ objectFit: 'contain', height: 400, backgroundColor: '#f9f9f9', borderRadius: 2 }}
              />
            ))
          ) : (
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#eee' }}>
              <Typography variant="body2" color="text.disabled">
                No hay imágenes disponibles
              </Typography>
            </Box>
          )}
        </Carousel>

        <CardContent>
          <Typography variant="h5" fontWeight="700" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
            {product.description || 'Descripción no disponible.'}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
            Precio: ${product.price.toFixed(2)}
          </Typography>

          <TextField
            type="number"
            label="Cantidad"
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1 }}
            fullWidth
            sx={{ mb: 2 }}
          />

          {sizeOptions.length > 0 && (
            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
              <InputLabel id="size-label">Talle</InputLabel>
              <Select labelId="size-label" value={size} onChange={handleSizeChange} label="Talle">
                {sizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {size === 'Personalizado' && (
            <TextField
              label="Describinos tu personalizado"
              variant="outlined"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Describe tu talle personalizado aquí"
            />
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={
              quantity < 1 ||
              (sizeOptions.length > 0 && (size === '' || (size === 'Personalizado' && customText.trim() === '')))
            }
          >
            Añadir al Carrito
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Producto añadido al carrito correctamente.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Product;
