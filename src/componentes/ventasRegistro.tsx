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
} from '@mui/material';
import { Close as CloseIcon } from "@mui/icons-material";
import {Toaster } from "mui-sonner";

import { Link } from "react-router-dom";
import { getVentas } from "../assets/services/ventasService";

import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

 
const VentasRegistro = () => {
    const [ventas, setVentas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState<Dayjs | null>(null);

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

    if (error) return (
        <Alert severity="error" sx={{ my: 2 }}>
            {error}
        </Alert>
    );


    return (
        <Card sx={{
            width: "80%",
            // height: "clamp(80%, 40vw, 100rem)",
            height: "84vh",
            margin: "auto",
            alignItems: "center",

        }}>
            <Typography fontSize={'clamp(1rem, 3.5vw, 3rem)'} display={"flex"} justifyContent={"center"}>Historial de Ventas</Typography>
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

            <TableContainer component={Paper} sx={{ height: "clamp(10vh, 56vh, 60vh)" }}>

                <Toaster duration={2000} />
                <Table sx={{ minWidth: 650 }} aria-label="Tabla de ventas" stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="justify" sx={{ fontWeight: 'bold' }}>CÓDIGO DE PRODUCTO VENDIDO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>PRODUCTO VENDIDO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>CANTIDAD</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>FECHA DE VENTA</TableCell>
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
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>


            </TableContainer>


        </Card>
    );
};


export default VentasRegistro;