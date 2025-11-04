import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = ({ cartItemCount, logoSrc = '/SLC.png', onFilterCategory }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Funciones para filtrar
  const handleFilterPotrero = () => {
    onFilterCategory('potrero');
  };

  const handleFilterOnePeace = () => {
    onFilterCategory('one peace');
  };

  const handleFilterAll = () => {
    onFilterCategory('Todas');
  };

  return (
    <AppBar position="static" color="secondary" sx={{ px: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={logoSrc} alt="Logo SLC" style={{ height: 60, marginRight: 10, borderRadius: 8 }} />
          </Link>

          <Button variant="outlined" color="inherit" onClick={handleFilterPotrero}>
            Potrero
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleFilterOnePeace}>
            One Peace
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleFilterAll}>
            Todos los productos
          </Button>
        </Box>

        {/* Menu para pantallas pequeñas */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem component={Link} to="/" onClick={() => { handleMenuClose(); handleFilterAll(); }}>
              Catálogo
            </MenuItem>
            <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
              &nbsp;Carrito
            </MenuItem>
          </Menu>
        </Box>

        {/* Botones de carrito para pantallas grandes */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 'bold' }}>
            Catálogo
          </Button>
          <Tooltip title="Ver carrito">
            <Button
              color="inherit"
              component={Link}
              to="/cart"
              startIcon={
                <Badge badgeContent={cartItemCount} color="secondary" overlap="circular">
                  <ShoppingCartIcon />
                </Badge>
              }
              sx={{ fontWeight: 'bold' }}
            >
              Carrito
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
