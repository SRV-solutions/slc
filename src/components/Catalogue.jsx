import React, { useMemo } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useParams } from 'react-router-dom';

const Catalogue = ({ products, categoryFilter = 'Todas' }) => {
  const navigate = useNavigate();
  // Precio máximo entre productos para filtro dinámico
  const productMaxPrice = useMemo(() => {
    if (!products.length) return 50000;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  // Estados locales para filtros además de categoría
  const [priceMin, setPriceMin] = React.useState(0);
  const [priceMax, setPriceMax] = React.useState(productMaxPrice);
  const [sortBy, setSortBy] = React.useState('popularity'); // popularidad, precioAsc, precioDesc

  // Categorías únicas con "Todas"
  const categories = useMemo(() => {
    const all = products.map((p) => p.category?.trim() || 'Sin categoría');
    return ['Todas', ...Array.from(new Set(all))];
  }, [products]);

  // Normalizar texto para comparar categorías sin importar mayúsculas ni espacios
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '');

  // Aplicar filtro combinado: categoría externa + filtros internos (precio, orden)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryFilter.toLowerCase() !== 'todas') {
      filtered = filtered.filter(p => normalize(p.category) === normalize(categoryFilter));
    }

    filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);

    switch (sortBy) {
      case 'precioAsc':
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
      case 'precioDesc':
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        filtered = filtered.slice().sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
    }

    return filtered;
  }, [products, categoryFilter, priceMin, priceMax, sortBy]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ margin: '2rem', maxWidth: 1200, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          mb: 4,
          backgroundColor: '#f5f5f5',
          p: 2,
          borderRadius: 2,
        }}
      >
        <FormControl sx={{ minWidth: 160 }} size="small" variant="standard">
          <InputLabel id="category-label" sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} /> Categoría
          </InputLabel>
          <Select
            labelId="category-label"
            value={categoryFilter}
            label="Categoría"
            // Si quieres manejar cambio aquí, tendrías que elevar estado desde App para sincronizar
            readOnly
            sx={{ borderRadius: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small" variant="outlined">
          <InputLabel id="price-min-label">Precio Mín</InputLabel>
          <Select
            labelId="price-min-label"
            value={priceMin}
            label="Precio Mín"
            onChange={(e) => setPriceMin(Number(e.target.value))}
          >
            {[0, 500, 1000, 2000, 3000, 5000, 10000].map((val) => (
              <MenuItem key={val} value={val}>{`$${val}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small" variant="outlined">
          <InputLabel id="price-max-label">Precio Máx</InputLabel>
          <Select
            labelId="price-max-label"
            value={priceMax}
            label="Precio Máx"
            onChange={(e) => setPriceMax(Number(e.target.value))}
          >
            {[500, 1000, 2000, 3000, 5000, 10000, productMaxPrice].map((val) => (
              <MenuItem key={val} value={val}>{`$${val}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} size="small" variant="outlined">
          <InputLabel id="sort-label">Ordenar por</InputLabel>
          <Select
            labelId="sort-label"
            value={sortBy}
            label="Ordenar por"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="popularity">Más Popular</MenuItem>
            <MenuItem value="precioAsc">Precio: Menor a Mayor</MenuItem>
            <MenuItem value="precioDesc">Precio: Mayor a Menor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.15s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardActionArea onClick={() => handleProductClick(product.id)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0] || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  sx={{
                    objectFit: 'contain',
                    backgroundColor: '#f9f9f9',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ textTransform: 'uppercase', fontWeight: '700', mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Chip label={product.category || 'Sin categoría'} color="secondary" size="small" variant="outlined" />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Catalogue
