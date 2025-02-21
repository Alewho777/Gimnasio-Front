import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  ThemeProvider,
  createTheme,
  Divider,
  Tooltip,
  Grid2,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { SupervisorAccount, Inventory,Analytics } from "@mui/icons-material";
import { getCurrentUser, logout } from "../assets/services/authService";
import logoGF from "../assets/images/logoGF.svg"


const drawerWidth = 240;
const collapsedWidth = 70;
const user = getCurrentUser();


const navItems = [
  { title: "Inicio", path: "/home", icon: <HomeIcon />, Tooltip: "Inicio" },
  { title: "Gestion", path: "/personas", icon: <SupervisorAccount />, Tooltip: "Gestion de Clientes" },
  { title: "Inventario", path: "/productos", icon: <Inventory />, Tooltip: "Gestion de Inventario" },
  { title: "Ventas", path: "/ventas", icon: <Analytics />, Tooltip: "Gestion de Informes y Ventas" },
];

export default function Layout() {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }} >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
            ml: `${open ? drawerWidth : collapsedWidth}px`,
            transition: "width 0.3s",
            background: 'linear-gradient(135deg, rgba(24, 60, 178, 0.66) 30%, rgba(24, 60, 178, 0.91) 90%)',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(!open)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Grid2 container display={"flex"} alignItems={"center"} flexWrap={"nowrap"} width={"100%"}>

              <Grid2 flex={1} justifyItems={"center"} flexDirection={'row'} display={'flex'}>

                {/* <CardMedia
                  component='img'
                  sx={{ height: "6vh", width: "5vw", objectFit: "cover" }}
                  image={logoGF}
                /> */}
                <Typography variant="h3" style={{ fontSize: 'clamp(1rem, 3.5vw, 3rem)' }} >
                  Gym & Fitness
                </Typography>
              </Grid2>
              <Grid2 flex={1} justifyItems={"end"} flexWrap={'wrap'} paddingRight={'50px'}>
                {/* <Typography sx={{ display: { xs: "none", sm: "block" } }} style={{ fontSize: 'clamp(0.8rem, 1vw, 2rem)', }}  >
                  Bienvenido {user?.username}
                </Typography> */}
                <Tooltip title={user?.username} arrow followCursor>
                  <Avatar
                    alt="Usuario"
                    src={logoGF}
                    onClick={handleMenuOpen}
                    sx={{ cursor: "pointer", marginLeft: 2, width: '5vw', height: '5vh' }}
                  />
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem disabled>Bienvenido, {user?.username}</MenuItem>
                  <Divider />

                  <Grid2 display={'fex'} justifyContent={'center'}>
                    <Tooltip title='Cambiar de Tema' arrow followCursor>
                      <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                      </IconButton>
                    </Tooltip>
                  </Grid2>
                  <Divider />
                  <Grid2 display={'fex'} justifyContent={'center'}>
                    <MenuItem sx={{ width: '100%', justifyContent: 'center' }} onClick={() => { logout(); navigate('/login') }}>Cerrar Sesión</MenuItem>
                  </Grid2>
                </Menu>

              </Grid2>
              {/* <Grid2>
                <Button
                  color="inherit"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  style={{ fontSize: 'clamp(0.8rem, 1vw, 2rem)' }}
                >
                  Cerrar Sesión
                </Button>
              </Grid2> */}
              {/* <Grid2>
              <Tooltip title='Cambiar de Tema' arrow followCursor>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                </Tooltip>
              </Grid2> */}
            </Grid2>
          </Toolbar>
        </AppBar>

        {/* Sidebar (Drawer) */}
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : collapsedWidth,
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          <Toolbar />

          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
                <Tooltip title={item.Tooltip} placement="right-start" arrow>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.title} sx={{ ml: 2 }} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Contenido Principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
            transition: "width 0.3s",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
