import React, { useMemo, useEffect } from 'react';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Catalogue = ({ products }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Leer filtros desde la URL
  const categoryFilter = searchParams.get('category') || 'Todas';
  const initialPriceMin = Number(searchParams.get('priceMin')) || 0;
  const initialPriceMax = Number(searchParams.get('priceMax')) || 0;
  const initialSortBy = searchParams.get('sortBy') || 'popularity';

  const productMaxPrice = useMemo(() => {
    if (!products.length) return 40000;    
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  // Estados sincronizados con URL
  const [priceMin, setPriceMin] = React.useState(initialPriceMin);
  const [priceMax, setPriceMax] = React.useState(initialPriceMax || productMaxPrice);
  const [sortBy, setSortBy] = React.useState(initialSortBy);
  const [category, setCategory] = React.useState(categoryFilter);

  // Categorías únicas
  const categories = useMemo(() => {
    const all = products.map((p) => p.category?.trim() || 'Sin categoría');
    return ['Todas', ...Array.from(new Set(all))];
  }, [products]);

  // Normalizar texto
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '');

  // Mantener categoría sincronizada con URL y viewport (si quieres puedes ajustar lógica aquí)
  // useEffect(() => {
  //   if (categoryFilter !== category) {
  //     setCategory(categoryFilter);
  //   }
  // }, [categoryFilter, category]);

  // Actualizar URL cuando cambian filtros
  useEffect(() => {
    const params = {};
    if (category && category !== 'Todas') params.category = category;
    if (priceMin > 0) params.priceMin = priceMin;
    if (priceMax < productMaxPrice) params.priceMax = priceMax;
    if (sortBy !== 'popularity') params.sortBy = sortBy;
    // setSearchParams(params);
  }, [category, priceMin, priceMax, sortBy, setSearchParams, productMaxPrice]);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (category && category.toLowerCase() !== 'todas') {
      filtered = filtered.filter((p) => normalize(p.category) === normalize(category));
    }

    filtered = filtered.filter((p) => p.price >= priceMin && p.price <= priceMax);

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
  }, [products, category, priceMin, priceMax, sortBy]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Box sx={{ margin: '2rem auto', maxWidth: 1200, px: isSmallScreen ? 2 : 0 }}>
      {/* Filtros */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          width: '100%',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: isSmallScreen ? 'stretch' : 'center',
          mb: 4,
          bgcolor: '#000000ff',
          p: 2,
          borderRadius: 2,
        }}
      >
        <FormControl
          color="secondary"
          sx={{
            minWidth: 160,
            flexGrow: isSmallScreen ? 1 : 'unset',
            // Color para texto del label y del Select
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiSelect-root': { color: 'white' },
            // Color para el icono del label (FilterListIcon)
            '& .MuiInputLabel-icon': { color: 'white' },
            // Color para borde cuando está activo o enfocado
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'darkwhite' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
            // Para cambiar el color del icono desplegable en Select
            '& .MuiSelect-icon': { color: 'white' },
          }}
          size="small"
          variant="outlined"
        >
          <InputLabel id="category-label" sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1, color: 'white' }} /> Categoría
          </InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="Categoría"
            onChange={(e) => setCategory(e.target.value)}
            sx={{ borderRadius: 2, color: 'white' }}
            fullWidth={isSmallScreen}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl sx={{
          minWidth: 160,
          flexGrow: isSmallScreen ? 1 : 'unset',
          // Color para texto del label y del Select
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiSelect-root': { color: 'white' },
          // Color para el icono del label (FilterListIcon)
          '& .MuiInputLabel-icon': { color: 'white' },
          // Color para borde cuando está activo o enfocado
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'darkwhite' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
          // Para cambiar el color del icono desplegable en Select
          '& .MuiSelect-icon': { color: 'white' },
        }} size="small" variant="outlined">
          <InputLabel id="price-min-label">Precio Mín</InputLabel>
          <Select
            labelId="price-min-label"
            value={priceMin}   
            label="Precio Mín"
            sx={{ borderRadius: 2, color: 'white' }}

            onChange={(e) => setPriceMin(Number(e.target.value))}
            fullWidth={isSmallScreen}
          >
            {[0, 500, 1000, 2000, 3000, 5000, 10000, 40000].map((val) => (
              <MenuItem key={val} value={val}>{`$${val}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{
          minWidth: 160,
          flexGrow: isSmallScreen ? 1 : 'unset',
          // Color para texto del label y del Select
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiSelect-root': { color: 'white' },
          // Color para el icono del label (FilterListIcon)
          '& .MuiInputLabel-icon': { color: 'white' },
          // Color para borde cuando está activo o enfocado
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'darkwhite' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
          // Para cambiar el color del icono desplegable en Select
          '& .MuiSelect-icon': { color: 'white' },
        }} size="small" variant="outlined">
          <InputLabel id="price-max-label">Precio Máx</InputLabel>
          <Select
            labelId="price-max-label"
            value={priceMax}
            label="Precio Máx"
            sx={{ borderRadius: 2, color: 'white' }}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            fullWidth={isSmallScreen}
          >
            {[500, 1000, 2000, 3000, 5000, 10000, 40000, productMaxPrice].map((val) => (
              <MenuItem key={val} value={val}>{`$${val}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{
          minWidth: 160,
          flexGrow: isSmallScreen ? 1 : 'unset',
          // Color para texto del label y del Select
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiSelect-root': { color: 'white' },
          // Color para el icono del label (FilterListIcon)
          '& .MuiInputLabel-icon': { color: 'white' },
          // Color para borde cuando está activo o enfocado
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'darkwhite' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
          // Para cambiar el color del icono desplegable en Select
          '& .MuiSelect-icon': { color: 'white' },
        }} size="small" variant="outlined">
          <InputLabel id="sort-label">Ordenar por</InputLabel>
          <Select
            labelId="sort-label"
            value={sortBy}
            label="Ordenar por"
            sx={{ borderRadius: 2, color: 'white' }}

            onChange={(e) => setSortBy(e.target.value)}
            fullWidth={isSmallScreen}
          >
            <MenuItem value="popularity">Más Popular</MenuItem>
            <MenuItem value="precioAsc">Precio: Menor a Mayor</MenuItem>
            <MenuItem value="precioDesc">Precio: Mayor a Menor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Productos */}
      <Grid container spacing={4} px={2} justifyContent="center">
        {filteredProducts.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={6} lg={4} xl={3}>
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
                  <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: '700', mb: 1 }}>
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

export default Catalogue;
