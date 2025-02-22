import { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  TextField,
  Card,
  Divider,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ShoppingCart } from "@mui/icons-material";
import { toast, Toaster } from "mui-sonner";
import React from "react";
import { Link } from "react-router-dom";
import { actualizarProductoPorCodigo, eliminarProducto, getProductoByCodigo, getProductos } from "../assets/services/productoService";
import { createVenta } from "../assets/services/ventasService";
import { Producto } from "../context/producto";
import ModalEliminar from "../hooks/ModalEliminar";

const ProductoTable = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualozando, setActualozando] = useState(false);
  const [vendiendo, setVendiendo] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openVenta, setOpenVenta] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(Number);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Producto[]>([]);

  const [buscarTabla, setBuscarTabla] = useState("");
  const handleOpen = (codigo: string) => {
    setProductoAEliminar(codigo);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<any | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProductos();
        if (Array.isArray(data)) {
          const productosActivos = data.filter(productos => productos.estado === 1);
          setProductos(productosActivos);
        } else {
          setError("Formato de datos inválido");
        }
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const handleEliminarProducto = async (codigo: String) => {
    setEliminando(true);
    try {
      await eliminarProducto(codigo);
      setProductos(productos.filter(producto => producto.codigo !== codigo));
      toast.success("Producto eliminado con ÉXITO");

    } catch {
      setError("Error al eliminar Persona");
      toast.error("Error al eliminar el producto");
    } finally {
      handleClose();
      setEliminando(false);
    }
  };




  const handleEditClick = (producto: any) => {
    setSelectedProducto({ ...producto });
    setOpenEdit(true);
  };

  const handleUpdateProducto = async () => {
    if (!selectedProducto) return;
    setActualozando(true);
    try {
      await actualizarProductoPorCodigo(selectedProducto.codigo, {
        codigo: selectedProducto.codigo,
        nombre: selectedProducto.nombre,
        stock: selectedProducto.stock,
        precio: selectedProducto.precio,
      });
      toast.success(`Datos del producto ${selectedProducto.nombre} actualizado con éxito`);
      setSelectedProducto(false);
      setProductos(productos.map(p => (p.codigo === selectedProducto.codigo ? selectedProducto : p)));
      setOpenEdit(false);
    } catch (error: any) {
      toast.error("Error al actualizar los datos del producto");
      if (error.response?.status === 401) {
        toast.error("Sesión expirada - Por favor vuelva a iniciar sesión");
      } else {
        toast.error(`Error al actualizar: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setActualozando(false);
    }
  };


  if (error) return (
    <Alert severity="error" sx={{ my: 2 }}>
      {error}
    </Alert>
  );

  const handleVender = async () => {
    if (!selectedProducto || cantidad <= 0 || cantidad > selectedProducto.stock) {
      toast.error("Cantidad inválida");
      return;
    }
    setVendiendo(true);
    try {
      await createVenta({
        producto: selectedProducto,
        cantidad: cantidad,
        total: total,
      });
      setProductos(prev => prev.map(p =>
        p.codigo === selectedProducto.codigo
          ? { ...p, stock: p.stock - cantidad }
          : p
      ));

      toast.success("Venta realizada EXITOSAMENTE");
      setOpenVenta(false);
      setSelectedProducto(false);
      setSearchTerm("");
      handleSearch("");
      setCantidad(0);
      setTotal(cantidad * selectedProducto.precio);
    } catch (error) {
      toast.error("Error al registrar la venta");
    } finally {
      setVendiendo(false);
      setSearchTerm("");
      handleSearch("");
      setSelectedProducto(false);
    }
  };

  const handleSearch = async (term: string) => {
    setBuscando(true);
    try {
      setSearchResults([]);

      if (!term.trim()) return;
      if (/^\d+$/.test(term)) {
        try {
          const producto = await getProductoByCodigo(term);
          setSearchResults([producto]);
        } catch (error) {
          const productos = await getProductos();
          const filtered = productos.filter(p =>
            p.nombre.toLowerCase().includes(term.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } else {
        const productos = await getProductos();
        const filtered = productos.filter(p =>
          p.nombre.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      toast.error("Error en la búsqueda");
    } finally {
      setVendiendo(false);
      setBuscando(false);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    if (buscarTabla && !(
      producto.codigo.includes(buscarTabla) ||
      producto.nombre.toLowerCase().includes(buscarTabla.toLowerCase()) ||
      producto.precio.toString().includes(buscarTabla) ||
      producto.stock.toString().includes(buscarTabla)
    )) return false;

    return true;
  });

  return (
    <Card sx={{
      width: "80%",
      height: "84vh",
      margin: "auto",
      alignItems: "center",

    }}>
      <Typography fontSize={'clamp(1rem, 3.5vw, 3rem)'} display={"flex"} justifyContent={"center"}>GESTION DE PRODUCTOS</Typography>
      <Tooltip title="Regresar a la pagina anterior" arrow placement="top">
        <Button size="small" component={Link}
          to="/productos"
          variant="outlined"
          sx={{ mt: 2, marginBottom: '10px', marginRight: '10px' }}>Regresar</Button>
      </Tooltip>
      <Tooltip title='Realizar la venta de un producto' arrow placement="top">
        <Button variant="contained" color="warning" onClick={() => setOpenVenta(true)}>
          <ShoppingCart /> Vender
        </Button>
      </Tooltip>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar..."
          variant="outlined"
          value={buscarTabla}
          onChange={(e) => setBuscarTabla(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>
      <Divider />

      <TableContainer component={Paper} sx={{ height: "clamp(10vh, 56vh, 60vh)" }}>

        <Toaster duration={2000} />
        <Table sx={{ minWidth: 650 }} aria-label="Tabla de productos" stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>CODIGO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>NOMBRE</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }} >STOCK</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>PRECIO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (

                productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell align="center" >{producto.codigo}</TableCell>
                    <TableCell align="center" >{producto.nombre}</TableCell>
                    <TableCell align="center" >{producto.stock}</TableCell>
                    <TableCell align="center">${producto.precio}</TableCell>

                    {/* <TableCell > <IconButton onClick={() => handleEliminarPersona(persona.cedula)}><DeleteIcon /></IconButton></TableCell> */}
                    <TableCell align="center">
                      <Tooltip title="Eliminar datos" arrow placement="top">
                        <IconButton color="error" onClick={() => handleOpen(producto.codigo)}><DeleteIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Actualizar datos" arrow placement="top">
                        <IconButton color="warning" onClick={() => handleEditClick(producto)}><EditIcon /></IconButton>
                      </Tooltip>

                      
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
        <Modal open={openEdit} onClose={(reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    setOpenEdit(false);
                }
            }} disableEscapeKeyDown>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            minWidth: '300px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}>
            <Typography variant="h6">Editar Producto</Typography>
            <TextField
              label="Código"
              value={selectedProducto?.codigo || ""}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Nombre"
              value={selectedProducto?.nombre || ""}
              fullWidth
              margin="normal"
              onChange={(e) => setSelectedProducto({ ...selectedProducto, nombre: e.target.value })}
            />
            <TextField
              label="Stock"
              type="text"
              value={selectedProducto?.stock || ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                setSelectedProducto({ ...selectedProducto, stock: value });
            }}
            />
            <TextField
              label="Precio"
              type="text"
              value={selectedProducto?.precio || ""}
              fullWidth
              margin="normal"
              onChange={(e) => {
                let value = e.target.value.replace(",", ".");
                value = value.replace(/[^0-9.]/g, "");
                const parts = value.split(".");
                if (parts.length > 2) {
                  value = parts[0] + "." + parts.slice(1).join("");
                }
          
                setSelectedProducto({ ...selectedProducto, precio: value });
              }}
            />

            <Box display="flex" justifyContent="end" gap={2} mt={2}>
              <Tooltip title='Actualizar datos' arrow placement="top">
                <Button
                  variant="contained"
                  onClick={handleUpdateProducto}
                  disabled={actualozando}

                >{actualozando ? <CircularProgress size={25} color="inherit" /> : 'Actualizar'}</Button>
              </Tooltip>
              <Button color="error" variant="outlined" disabled={actualozando} onClick={() => { setOpenEdit(false), setSelectedProducto(false) }}>Cancelar</Button>
            </Box>
          </Box>
        </Modal>

      </TableContainer>

      <Modal open={openVenta} onClose={(reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          setOpenVenta(false);
        }
      }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflowY: "scroll",
          width: 500,
          minWidth: '300px',
          bgcolor: 'background.paper',
          p: 4,
          boxShadow: 24,
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            Registrar Venta
          </Typography>

          <TextField
            label="Buscar por nombre"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value
                .replace(/^\d/, '') 
                .toLowerCase();
              setSearchTerm(value);
              handleSearch(value);
            }}


            slotProps={{ htmlInput: { pattern: "^[^0-9].*", maxLength: 50 } }}
            onKeyDown={(e) => {
              if (searchTerm == '' && !isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}


          />

          <Paper sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
            {
              buscando ? (
                <MenuItem>
                  <CircularProgress size={30} />
                </MenuItem>
              ) : (
                searchResults.map(producto => (
                  <MenuItem
                    key={producto.codigo}
                    onClick={() => {
                      setSelectedProducto(producto);
                      setCantidad(0);
                    }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      bgcolor: selectedProducto?.codigo === producto.codigo ? '#f0f0f0' : 'inherit'
                    }}
                  >
                    <div>
                      <Typography variant="body1">{producto.nombre}</Typography>
                      <Typography variant="caption">Código: {producto.codigo}</Typography>
                    </div>
                    <Typography variant="body2">Stock: {producto.stock}</Typography>
                  </MenuItem>
                ))
              )}
          </Paper>

          {selectedProducto && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                margin="normal"
                value={cantidad}
                onChange={(e) => {
                  const maxStock = selectedProducto.stock;
                  let value = e.target.value.replace(/\D/g, ""); 
                  let intValue = parseInt(value, 10);
                  intValue = Math.min(Math.max(1, intValue || 1), maxStock);
                  setCantidad(intValue || 1);
                }}

                slotProps={{ htmlInput: { min: 1, max: selectedProducto.stock } }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${(selectedProducto.precio * cantidad).toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Tooltip title='Realizar venta' arrow placement="top">
              <Button
                variant="contained"
                onClick={handleVender}
                disabled={!selectedProducto || vendiendo}
              >
                {vendiendo ? <CircularProgress size={25} color="inherit" /> : 'Confirmar Venta'}
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              color="error"
              disabled={vendiendo}
              onClick={() => { setOpenVenta(false), setSelectedProducto(false), handleSearch(''), setSearchTerm('') }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      <ModalEliminar
                        isloading={eliminando}
                        open={open}
                        onClose={() => setOpen(false)}
                        onConfirm={() => productoAEliminar && handleEliminarProducto(productoAEliminar)}
                        itemName="esta persona"
                      />
    </Card>
  );
};


export default ProductoTable;