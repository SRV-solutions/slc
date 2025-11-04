import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  IconButton,
  CardMedia,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, clearCart, removeFromCart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Calcular total
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Card
      sx={{
        maxWidth: 650,
        margin: '30px auto',
        padding: 3,
        borderRadius: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        bgcolor: '#fff',
      }}
    >
      <Typography variant="h4" fontWeight="700" gutterBottom color="primary">
        Carrito de Compras
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay productos en el carrito.
        </Typography>
      ) : (
        <>
          <List disablePadding>
            {cart.map((product, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    px: 2,
                  }}
                >
                  <Typography fontWeight="600" sx={{ flexGrow: 1, textTransform: 'uppercase' }}>
                    {product.name}
                  </Typography>
                  <Typography color="primary" fontWeight="bold">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      mb: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={product.images ? product.images[0] : product.image}
                      alt={product.name}
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        borderRadius: 2,
                        bgcolor: '#f9f9f9',
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {product.description || 'Sin descripción.'}
                      </Typography>
                      {product.type === 'remera' && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          <strong>Talle:</strong> {product.size || 'N/A'}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => removeFromCart(index)}
                      aria-label="Eliminar producto"
                      sx={{ ml: 'auto' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="700" color="primary">
              Total: ${totalPrice.toFixed(2)}
            </Typography>
            <Button variant="outlined" color="error" onClick={clearCart} startIcon={<DeleteIcon />}>
              Vaciar carrito
            </Button>
          </Stack>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleCheckout}
            sx={{ borderRadius: 3, fontWeight: '700' }}
          >
            Realizar Pedido
          </Button>
        </>
      )}
    </Card>
  );
};

export default Cart;
