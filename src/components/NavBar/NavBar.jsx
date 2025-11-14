import React from "react";
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
  Container,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useSearchParams } from "react-router-dom";

const NavBar = ({ cartItemCount, categories = ['Todas', 'Potrero', 'One Piece'], logoSrc = "/SLC.png" }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Leer categoría actual desde URL para resaltar o sincronizar si quieres
  const currentCategory = searchParams.get('category') || 'Todas';

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const goToCategory = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "Todas") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    // Opcional: limpiar otros params si quieres resetear
    navigate(`/?${params.toString()}`);
    handleMenuClose();
  };

  const goToCart = () => {
    navigate("/cart");
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={2}
      color="secondary"
      sx={{
        color: "#fff",
        py: 1,
        backdropFilter: "blur(8px)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* LOGOS */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={logoSrc}
              alt="Logo SLC"
              sx={{
                height: 80,
                borderRadius: 2,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => navigate("/")}
            />
          </Box>

          {/* Botones (desktop) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={currentCategory === cat ? "outlined" : "text"}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderColor: currentCategory === cat ? "#fff" : "transparent",
                  "&:hover": currentCategory === cat ? { backgroundColor: "#fff", color: "#000" } : {},
                }}
                onClick={() => goToCategory(cat)}
              >
                {cat === "One Piece" ? "One Peace" : cat}
              </Button>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: "rgba(255,255,255,0.3)" }} />
            <Tooltip title="Ver carrito">
              <Button
                color="inherit"
                onClick={goToCart}
                startIcon={
                  <Badge badgeContent={cartItemCount} color="primary" overlap="circular">
                    <ShoppingCartIcon />
                  </Badge>
                }
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Carrito
              </Button>
            </Tooltip>
          </Box>

          {/* Menú móvil */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#2b2b2b",
                  color: "#fff",
                  mt: 1.5,
                  borderRadius: 2,
                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "#444",
                  },
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem
                  key={cat}
                  selected={currentCategory === cat}
                >
                  {cat === "One Piece"}
                </MenuItem>
              ))}
              <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.3)" }} />
              <MenuItem onClick={goToCart}>
                <Badge badgeContent={cartItemCount} color="secondary" sx={{ mr: 1 }}>
                  <ShoppingCartIcon />
                </Badge>
                Carrito
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
