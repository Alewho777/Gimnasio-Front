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
    Box,
    Button,
    Modal,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Card
} from '@mui/material';
import { Delete, Print, Preview, PostAdd } from "@mui/icons-material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getReportes, createReporte, eliminarReporte, calcularRangoFechas, RangoFechas } from "../assets/services/reporteService";
import { toast, Toaster } from "mui-sonner";
import dayjs, { Dayjs } from 'dayjs';
import ModalEliminar from "../hooks/ModalEliminar";
import { Reporte } from "../context/reportes";
import axios from "axios";
import { API_ROUTES } from "../config/api";
import { Persona } from "../context/persona";
import { Ventas } from "../context/ventas";
import React from "react";
import { Link } from "react-router-dom";
import { generarPDF } from "../hooks/generarPDF";

const ReporteTable = () => {
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [tipoReporte, setTipoReporte] = useState<'dia' | 'mes' | 'año'>('dia');
    const [fecha, setFecha] = useState<Dayjs | null>(dayjs());
    const [reporteAEliminar, setReporteAEliminar] = useState<number | null>(null);
    const [selectedReport, setSelectedReport] = useState<Reporte | null>(null);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [buscarTabla, setBuscarTabla] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<"todos" | "dia" | "mes" | "año">("todos");
    const [isLoadingGenerando, setIsLoadingGenerando] = useState(false);

    const handleOpen = (id: number) => {
        setReporteAEliminar(id);
        setOpen(true);
    };

    const handleShowDetails = (reporte: Reporte) => {
        setSelectedReport(reporte);
        setOpenDetailsModal(true);
    };

    const getTipoReporte = (filtros: any) => {
        try {
            if (!filtros) return 'N/A';
            const parsedFiltros = typeof filtros === 'string' ? JSON.parse(filtros) : filtros;
            return parsedFiltros.tipo?.toUpperCase() || 'N/A';
        } catch (error) {
            console.error("Error parsing filtros:", error);
            return 'N/A';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getReportes();
                setReportes(data);
            } catch (error) {
                console.error("Error fetching reportes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerarReporte = async () => {
        if (!fecha || !tipoReporte) {
            toast.error("Seleccione una fecha y tipo de reporte");
            return;
        }
        setIsLoadingGenerando(true);
        try {
            const rango: RangoFechas = calcularRangoFechas(tipoReporte, fecha);

            const [personasResponse, ventasResponse] = await Promise.all([
                axios.get(API_ROUTES.PERSONAS_POR_FECHA, {
                    params: {
                        start: rango.start,
                        end: rango.end
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                axios.get(API_ROUTES.VENTAS_POR_FECHA, {
                    params: {
                        start: rango.start,
                        end: rango.end
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            const reporteData = {
                tipo: tipoReporte,
                fecha: fecha.format('YYYY-MM-DD'),
                personas: JSON.stringify(personasResponse.data),
                ventas: JSON.stringify(ventasResponse.data),
                filtrosAplicados: JSON.stringify({
                    start: rango.start,
                    end: rango.end,
                    label: rango.label,
                    tipo: tipoReporte
                })
            };

            const nuevoReporte = await createReporte(reporteData);
            toast.success(`Reporte ${nuevoReporte.numeroInforme} generado exitosamente`);
            setReportes([...reportes, nuevoReporte]);
            setOpenModal(false);
        } catch (error) {
            toast.error("Error al generar el reporte: " + (error instanceof Error ? error.message : "Error desconocido"));
        } finally {
            setIsLoadingGenerando(false);
        }
    };

    const handleEliminarReporte = async (id: number) => {
        setEliminando(true);
        try {
            await eliminarReporte(id);
            setReportes(reportes.filter(reporte => reporte.id !== id));
            toast.success('Reporte eliminado con ÉXITO');
        } catch (error) {
            toast.error('ERROR al eliminar el reporte');
        } finally {
            setOpen(false);
            setEliminando(false);
        }
    };

    const reportesFiltrados = reportes.filter(reporte => {
        const filtrosAplicados = reporte.filtrosAplicados ? JSON.parse(reporte.filtrosAplicados) : {};
        if (filtroEstado !== "todos" && filtrosAplicados.tipo !== filtroEstado) return false;

        if (buscarTabla && !(
            reporte.numeroInforme.toLocaleLowerCase().includes(buscarTabla) ||
            reporte.filtrosAplicados.toString().toLowerCase().includes(buscarTabla.toLowerCase())
        )) return false;

        return true;
    });

    return (
        <Card sx={{ width: "90%", height: "84vh", margin: "auto" }}>
            <Toaster duration={2000} />

            <Typography variant="h4" textAlign="center" py={2}>Reportes</Typography>
            <Tooltip title="Regresar a la pagina anterior" arrow placement="top">
                <Button size="small" component={Link}
                    to="/ventas"
                    variant="outlined"
                    sx={{ mt: 2, marginBottom: '10px', marginRight: '10px' }}>Regresar</Button>
            </Tooltip>
            <Box sx={{ display: 'flex', gap: 2, p: 2 }}>

                <TextField
                    label="Buscar reportes..."
                    variant="outlined"
                    value={buscarTabla}
                    onChange={(e) => setBuscarTabla(e.target.value)}
                    sx={{ width: 400 }}
                />
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>Tipo de reporte</InputLabel>
                    <Select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value as any)}
                        label="Estado"
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="dia">Día</MenuItem>
                        <MenuItem value="mes">Mes</MenuItem>
                        <MenuItem value="año">Año</MenuItem>
                    </Select>
                </FormControl>
                <Tooltip title="Generar un nuevo reporte" arrow placement="top">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => setOpenModal(true)}
                    ><PostAdd />Generar Reporte
                    </Button>
                </Tooltip>
            </Box>

            <TableContainer component={Paper} sx={{ height: "54vh" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>N° Reporte</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fecha Generación</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Periodo Reportado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : reportesFiltrados.map((reporte) => (
                            <TableRow key={reporte.id}>
                                <TableCell align="center">{reporte.numeroInforme}</TableCell>
                                <TableCell align="center">
                                    {new Date(reporte.fechaGeneracion).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                    {getTipoReporte(reporte.filtrosAplicados)}
                                </TableCell>
                                <TableCell align="center">
                                    {reporte.filtrosAplicados &&
                                        JSON.parse(reporte.filtrosAplicados).label}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Imprimir" arrow placement="top">
                                        <IconButton color="primary" onClick={() => generarPDF({ reporte })}>
                                            <Print />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar" arrow placement="top">
                                        <IconButton
                                            color="error" onClick={() => handleOpen(reporte.id)}><Delete /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Detalles" arrow placement="top">
                                        <IconButton
                                            onClick={() => handleShowDetails(reporte)}
                                        >
                                            <Preview />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openModal} onClose={(reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    setOpenModal(false);
                }
            }}
                disableEscapeKeyDown>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" mb={2}>Generar Nuevo Reporte</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tipo de Reporte</InputLabel>
                        <Select
                            value={tipoReporte}
                            onChange={(e) => setTipoReporte(e.target.value as any)}
                            label="Tipo de Reporte"
                        >
                            <MenuItem value="dia">Día</MenuItem>
                            <MenuItem value="mes">Mes</MenuItem>
                            <MenuItem value="año">Año</MenuItem>
                        </Select>
                    </FormControl>

                    <DatePicker
                        views={tipoReporte === 'dia' ? ['year', 'month', 'day']
                            : tipoReporte === 'mes' ? ['year', 'month']
                                : ['year']}
                        label="Seleccionar fecha"
                        value={fecha}
                        onChange={(newValue) => setFecha(newValue)}
                        sx={{ width: '100%', mb: 2 }}
                    />

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Tooltip title='Generar' arrow placement="top">

                            <Button
                                variant="contained"
                                disabled={isLoadingGenerando}
                                onClick={handleGenerarReporte}
                            >
                                {isLoadingGenerando ? <CircularProgress size={25} color="inherit" /> : 'Generar Reporte'}

                            </Button>
                        </Tooltip>
                        <Button
                            color="error"
                            variant="outlined"
                            disabled={isLoadingGenerando}
                            onClick={() => setOpenModal(false)}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 1000,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    {selectedReport && (
                        <>
                            {/* ... */}
                            <Typography variant="h5" gutterBottom>
                                Detalles del Reporte: {selectedReport.numeroInforme}
                            </Typography>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1">
                                    Fecha de Generación: {new Date(selectedReport.fechaGeneracion).toLocaleDateString()}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Tipo: {getTipoReporte(selectedReport.filtrosAplicados)}
                                </Typography>
                            </Box>
                            {selectedReport.personas && (
                                <>
                                    <Typography variant="h6" gutterBottom>Personas Inscritas</Typography>
                                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cédula</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nombres</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Apellidos</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Suscripcion</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fecha Inscripción</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {JSON.parse(selectedReport.personas).map((persona: Persona) => (
                                                    <TableRow key={persona.cedula}>
                                                        <TableCell align="center">{persona.cedula}</TableCell>
                                                        <TableCell align="center">{persona.nombres}</TableCell>
                                                        <TableCell align="center">{persona.apellidos}</TableCell>
                                                        <TableCell align="center">${persona.suscripcion}</TableCell>
                                                        <TableCell align="center">
                                                            {dayjs(persona.fechaInscripcion).format('DD/MM/YYYY')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}

                            {selectedReport.ventas && (
                                <>
                                    <Typography variant="h6" gutterBottom>Ventas Realizadas</Typography>
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fecha Venta</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {JSON.parse(selectedReport.ventas).map((venta: Ventas) => (
                                                    <TableRow key={venta.id}>
                                                        <TableCell align="center">{venta.producto.codigo}</TableCell>
                                                        <TableCell align="center">{venta.producto.nombre}</TableCell>
                                                        <TableCell align="center">{venta.cantidad}</TableCell>
                                                        <TableCell align="center">${venta.total.toFixed(2)}</TableCell>
                                                        <TableCell align="center">
                                                            {dayjs(venta.fechaVenta).format('DD/MM/YYYY')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                        Resumen Financiero
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableBody>
                                                {/* Filas de ganancias */}
                                                <TableRow>
                                                    <TableCell><strong>Tipo</strong></TableCell>
                                                    <TableCell><strong>Ganancias</strong></TableCell>
                                                </TableRow>

                                                {/* Ganancias de Personas */}
                                                <TableRow>
                                                    <TableCell>Ganancias de suscripciones</TableCell>
                                                    <TableCell>
                                                        ${JSON.parse(selectedReport.personas || '[]')
                                                            .reduce((acc: number, persona: Persona) => acc + persona.suscripcion, 0)
                                                            .toFixed(2)}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Ganancias de Productos */}
                                                <TableRow>
                                                    <TableCell>Ganancias de ventas</TableCell>
                                                    <TableCell>
                                                        ${JSON.parse(selectedReport.ventas || '[]')
                                                            .reduce((acc: number, venta: Ventas) => acc + venta.total, 0)
                                                            .toFixed(2)}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Total General */}
                                                <TableRow sx={{ '& td': { borderBottom: 'none' } }}>
                                                    <TableCell colSpan={1} align="right"><strong>Total</strong></TableCell>
                                                    <TableCell>
                                                        <strong>
                                                            ${(
                                                                JSON.parse(selectedReport.personas || '[]')
                                                                    .reduce((acc: number, persona: Persona) => acc + persona.suscripcion, 0) +
                                                                JSON.parse(selectedReport.ventas || '[]')
                                                                    .reduce((acc: number, venta: Ventas) => acc + venta.total, 0)
                                                            ).toFixed(2)}
                                                        </strong>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Modal>

            <ModalEliminar
                isloading={eliminando}
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={() => reporteAEliminar && handleEliminarReporte(reporteAEliminar)}
                itemName="este reporte" />
        </Card>
    );
};

export default ReporteTable;