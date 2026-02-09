import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  CardMedia,
  Box,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ cart, clearCart }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    celular: '',
    email: '',
    fecha: new Date().toISOString().slice(0, 10),
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('El carrito no puede estar vacío');
      return;
    }

    const productos = cart
      .map((item) => {
        let details = `Código: ${item.id}, Producto: ${item.name}, Cantidad: ${item.quantity}, Precio: $${item.price}`;
        console.log(item);
        if (
          (item.type === 'Remera' ||
            item.type === 'Short' ||
            item.type === 'Conjunto' ||
            item.type === 'Conjunto deportivo' ||
            item.type === 'Campera') &&
          item.size
        ) {
          details += `, Talle: ${item.size}`;
        }
        return details;
      })
      .join('; ');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const form = new FormData();
    form.append('entry.2086094249', formData.nombre);
    form.append('entry.1784657494', formData.apellido);
    form.append('entry.2068632283', formData.dni);
    form.append('entry.1644682657', formData.celular);
    form.append('entry.1294424446', formData.email);
    form.append('entry.1574738126', formData.fecha);
    form.append('entry.1104554283', productos);
    form.append('entry.181793812', 'Pendiente');
    form.append('entry.1532488736', total);

    try {
      await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSfhYwCNVXF1b0wU3siMi4gW1O3f7ZjzAnQZeH2HpDvr5EsoYg/formResponse',
        {
          method: 'POST',
          body: form,
          mode: 'no-cors',
        }
      );
      handleCheckout();
      clearCart();
      alert('Compra realizada con éxito.');
    } catch (error) {
      alert('Error al realizar la compra.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        mb: 8,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        p: 4,
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="700">
        Datos para la reserva
      </Typography>

      <Accordion sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="600">Productos en el carrito</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding>
            {cart.map((product, i) => (
              <ListItem key={i} sx={{ alignItems: 'flex-start', py: 1 }}>
                <CardMedia
                  component="img"
                  image={product.images?.[0]}
                  alt={product.name}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'contain',
                    borderRadius: 2,
                    bgcolor: '#f9f9f9',
                    mr: 2,
                  }}
                />
                <ListItemText
                  primary={
                    <Typography fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                      {product.name} - ${product.price.toFixed(2)}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {product.quantity}
                      </Typography>
                      {product.type === 'remera' && product.size && (
                        <Typography variant="body2" color="text.secondary">
                          Talle: {product.size}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {[
            { name: 'nombre', label: 'Nombre' },
            { name: 'apellido', label: 'Apellido' },
            { name: 'dni', label: 'DNI' },
            { name: 'celular', label: 'Celular' },
            { name: 'email', label: 'Email', type: 'email' },
          ].map(({ name, label, type }) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                required
                fullWidth
                type={type || 'text'}
                name={name}
                label={label}
                value={formData[name]}
                onChange={handleChange}
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 4, borderRadius: 3, fontWeight: '700' }}
        >
          Realizar Pedido
        </Button>
      </form>
    </Container>
  );
};

export default CheckoutForm;
