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
    IconButton,
    Typography,
    TextField,
    Card,
    Divider,
    Button,
    Tooltip,
    Modal,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from "@mui/icons-material";
import { toast, Toaster } from "mui-sonner";

import { Link } from "react-router-dom";
import { actualizarVenta, getVentas } from "../assets/services/ventasService";

import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const VentasRegistro = () => {
    const [ventas, setVentas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState<Dayjs | null>(null);
    const [selectedVenta, setSelectedVenta] = useState<any | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [actualozando, setActualozando] = useState(false);
    const [cantidad, setCantidad] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getVentas();
                if (Array.isArray(data)) {
                    setVentas(data);
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

    const handleEditClick = (venta: any) => {
        setSelectedVenta({
            ...venta,
            producto: venta.producto || { precio: 0 }
        });
        setCantidad(venta.cantidad);
        setOpenEdit(true);
    };

    const ventasFiltradas = ventas.filter(venta => {
        if (searchTerm && !(
            venta.producto.nombre.toLowerCase().includes(searchTerm) ||
            venta.producto.codigo.toLowerCase().includes(searchTerm) ||
            venta.total.toString().includes(searchTerm) ||
            venta.cantidad.toString().includes(searchTerm)
        )) return false;

        if (fechaFiltro) {
            const fechaVenta = dayjs(venta.fechaVenta).format("YYYY-MM-DD");
            const fechaSeleccionada = fechaFiltro.format("YYYY-MM-DD");

            if (fechaVenta !== fechaSeleccionada) {
                return false;
            }
        }

        return true;
    });

    const handleUpdateVenta = async () => {
        if (!selectedVenta) return;
        setActualozando(true);
        try {
            await actualizarVenta(selectedVenta.id, {
                cantidad: cantidad,
                total: selectedVenta.producto.precio * cantidad,
            });
            toast.success(`Venta actualizada con éxito`);
            // setSelectedVenta(false);
            setVentas(ventas.map(p =>
                p.id === selectedVenta.id ?
                    { ...selectedVenta, cantidad, total: selectedVenta.producto.precio * cantidad } : p
            ));
            setOpenEdit(false);
        } catch (error: any) {
            toast.error("Error al actualizar los datos de la venta");
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


    return (
        <Card sx={{
            width: "80%",
            height: "84vh",
            margin: "auto",
            alignItems: "center",

        }}>
            <Typography fontSize={'clamp(1rem, 3.5vw, 3rem)'} display={"flex"} justifyContent={"center"} sx={{ cursor: 'default' }}>Historial de Ventas</Typography>
            <Tooltip title="Regresar a la pagina anterior" arrow placement="top">
                <Button size="small" component={Link}
                    to="/ventas"
                    variant="outlined"
                    sx={{ mt: 2, marginBottom: '10px', marginRight: '10px' }}>Regresar
                </Button>
            </Tooltip>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Buscar..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 300 }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                    <DatePicker
                        views={['year', 'month', 'day']}
                        label="Filtrar"

                        value={fechaFiltro}
                        onChange={(newValue) => setFechaFiltro(newValue)}
                        slotProps={{
                            textField: {
                                sx: { width: 200 }
                            }
                        }}
                    />
                    {fechaFiltro && (
                        <IconButton onClick={() => setFechaFiltro(null)} color="error">
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>
            <Divider />

            <Toaster duration={2000} />

            <TableContainer component={Paper} sx={{ height: "clamp(10vh, 56vh, 60vh)", cursor: 'default' }}>

                <Toaster duration={2000} />
                <Table sx={{ minWidth: 650 }} aria-label="Tabla de ventas" stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="justify" sx={{ fontWeight: 'bold' }}>CÓDIGO DE PRODUCTO VENDIDO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>PRODUCTO VENDIDO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>CANTIDAD</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>FECHA DE VENTA</TableCell>
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

                                ventasFiltradas.map((venta) => (
                                    <TableRow key={venta.id}>
                                        <TableCell align="justify">{venta.producto.codigo}</TableCell>
                                        <TableCell align="center">{venta.producto.nombre}</TableCell>
                                        <TableCell align="center">{venta.cantidad}</TableCell>
                                        <TableCell align="center">${venta.total}</TableCell>
                                        <TableCell align="center">{venta.fechaVenta}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Actualizar datos" arrow placement="top">
                                                <IconButton color="warning" onClick={() => handleEditClick(venta)}><EditIcon /></IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>

                <Modal open={openEdit} onClose={(_event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        setOpenEdit(false);
                    }
                }} disableEscapeKeyDown>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40vw',
                        minWidth: '300px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}>
                        <Typography variant="h6" sx={{cursor: 'default'}}>Editar Venta</Typography>
                        <TextField
                            label="Nombre del Producto"
                            value={selectedVenta?.producto?.nombre || ""}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                        <TextField
                            label="Cantidad"
                            type="text"
                            value={cantidad}
                            fullWidth
                            margin="normal"
                            onChange={(e) => {
                                const maxStock = selectedVenta?.producto?.stock || 0;
                                const value = Math.min(Math.max(1, parseInt(e.target.value) || 1), maxStock);
                                setCantidad(value);
                            }}
                        />
                        <TextField
                            label="Total"
                            type="text"
                            value={(selectedVenta?.producto?.precio * cantidad).toFixed(2)}
                            fullWidth
                            disabled
                            margin="normal"
                        />

                        <Box display="flex" justifyContent="end" gap={2} mt={2}>
                            <Tooltip title='Actualizar datos' arrow placement="top">
                                <Button
                                    variant="contained"
                                    onClick={handleUpdateVenta}
                                    disabled={actualozando}

                                >{actualozando ? <CircularProgress size={25} color="inherit" /> : 'Actualizar'}</Button>
                            </Tooltip>
                            <Button color="error" variant="outlined" disabled={actualozando} onClick={() => { setOpenEdit(false), setSelectedVenta(null) }}>Cancelar</Button>
                        </Box>
                    </Box>
                </Modal>

            </TableContainer>


        </Card>
    );
};


export default VentasRegistro;