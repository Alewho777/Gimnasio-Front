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
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Card,
  Divider,
  Tooltip,
  Chip,
  InputLabel,
  MenuItem,
  Select,
  Grid2
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from "@mui/icons-material";
import { actualizarPersonaPorCedula, eliminarPersona, getPersonas } from "../assets/services/personaService";
import { toast, Toaster } from "mui-sonner";
import React from "react";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ModalEliminar from "../hooks/ModalEliminar";
import axios from "axios";
import { API_ROUTES } from "../config/api";

const PersonaTable = () => {
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actualozando, setActualozando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "1" | "2">("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState<Dayjs | null>(null);


  const handleOpen = (cedula: string) => {
    setPersonaAEliminar(cedula);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<any | null>(null);
  const [personaAEliminar, setPersonaAEliminar] = useState<string | null>(null);

  const verificarEstadoInscripcion = (fechaFin: string) => {
    const hoy = dayjs();
    const fechaFinDayjs = dayjs(fechaFin);
    return hoy.isAfter(fechaFinDayjs) ? 2 : 1;
  };

  useEffect(() => {
    const actualizarEstados = async () => {
      try {
        await axios.patch(API_ROUTES.ACTUALIZAR_ESTADOS_INSCRIPCION);

        const dataActualizada = await getPersonas();
        setPersonas(dataActualizada);
      } catch (error) {
      }
    };

    actualizarEstados();
  }, []);

  useEffect(() => {
    if (selectedPersona?.fechaInscripcion) {
      setSelectedPersona((prev: any) => ({
        ...prev,
        fecha_fin_Inscripcion: calcularFechaFin(prev.fechaInscripcion, prev.tipoInscripcion),
      }));
    }
  }, [selectedPersona?.fechaInscripcion, selectedPersona?.tipoInscripcion]);

  const personasFiltradas = personas.filter(persona => {
    if (filtroEstado !== "todos" && persona.estado_inscripcion.toString() !== filtroEstado) return false;

    if (searchTerm && !(
      persona.cedula.includes(searchTerm) ||
      persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.peso.toString().includes(searchTerm) ||
      persona.suscripcion.toString().includes(searchTerm)
    )) return false;

    if (fechaFiltro) {
      const mesSeleccionado = fechaFiltro.month();
      const añoSeleccionado = fechaFiltro.year();

      const fechaInicio = dayjs(persona.fechaInscripcion);
      const fechaFin = dayjs(persona.fecha_fin_Inscripcion);

      if (!(
        fechaInicio.month() <= mesSeleccionado &&
        fechaInicio.year() <= añoSeleccionado &&
        fechaFin.month() >= mesSeleccionado &&
        fechaFin.year() >= añoSeleccionado
      )) return false;
    }

    return true;
  });

  const calcularFechaFin = (fechaInicio: string, tipo: string) => {
    const fecha = new Date(fechaInicio);
    if (isNaN(fecha.getTime())) return "";

    switch (tipo) {
      case "semanal":
        fecha.setDate(fecha.getDate() + 7);
        break;
      case "quincenal":
        fecha.setDate(fecha.getDate() + 14);
        break;
      case "mensual":
        fecha.setMonth(fecha.getMonth() + 1);
        if (fecha.getDate() !== new Date(fechaInicio).getDate()) {
          fecha.setDate(0);
        }
        break;
      default:
        return "";
    }

    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPersonas();
        if (Array.isArray(data)) {
          const personasActualizadas = data.map(p => ({
            ...p,
          }));
          setPersonas(personasActualizadas);
        } else {
          setError("Formato de datos inválido");
        }
      } catch (err) {
        setError("Error al cargar los datos");
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleEliminarPersona = async (cedula: String) => {
    setEliminando(true);
    try {
      await eliminarPersona(cedula);
      setPersonas(personas.filter(personas => personas.cedula !== cedula));
      toast.success(`Datos  eliminados con ÉXITO`);

    } catch {
      setError("Error al eliminar Persona");
      toast.error("Error al eliminar los datos")
    } finally {
      handleClose();
      setEliminando(false);
    }
  };


  const handleEditClick = (persona: any) => {
    setSelectedPersona({
      ...persona,
      fecha_fin_Inscripcion: calcularFechaFin(persona.fechaInscripcion, persona.tipoInscripcion),
    });
    setOpenEdit(true);
  };


  const handleUpdatePersona = async () => {
    if (!selectedPersona) return;

    if (!selectedPersona.fechaInscripcion || !selectedPersona.fecha_fin_Inscripcion) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }
    setActualozando(true);

    try {
      await actualizarPersonaPorCedula(selectedPersona.cedula, {
        cedula: selectedPersona.cedula,
        nombres: selectedPersona.nombres,
        apellidos: selectedPersona.apellidos,
        fechaInscripcion: selectedPersona.fechaInscripcion,
        fecha_fin_Inscripcion: selectedPersona.fecha_fin_Inscripcion,
        peso: selectedPersona.peso,
        suscripcion: selectedPersona.suscripcion,
        genero: selectedPersona.genero,
        estado_inscripcion: verificarEstadoInscripcion(selectedPersona.fecha_fin_Inscripcion)
      });
      toast.success(`Datos de ${selectedPersona.nombres} ${selectedPersona.apellidos} actualizados con éxito`);
      const data = await getPersonas();
      const personasActualizadas = data.map(p => ({
        ...p,
      }));
      setPersonas(personasActualizadas);
      setOpenEdit(false);
    } catch (error: any) {
      toast.error("Error al actualizar los datos...");
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
      width: "90%",
      height: "84vh",
      margin: "auto",
      alignItems: "center",

    }}>
      <Typography fontSize={'clamp(1rem, 3.5vw, 3rem)'} display={"flex"} justifyContent={"center"}>GESTION DE CLIENTES</Typography>
      <Tooltip title="Regresar a la pagina anterior" arrow placement="top">
        <Button size="small" component={Link}
          to="/personas"
          variant="outlined"
          sx={{ mt: 2, marginBottom: '10px' }}>Regresar</Button>
      </Tooltip>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <FormControl sx={{ width: 300 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            label="Estado"
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="1">Activos</MenuItem>
            <MenuItem value="2">Desactivados</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          <DatePicker
            views={['year', 'month']}
            label="Filtrar por mes"

            value={fechaFiltro}
            onChange={(newValue) => setFechaFiltro(newValue)}
            slotProps={{
              textField: {
                sx: { width: 300 }
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
        <Table sx={{ minWidth: 650 }} aria-label="Tabla de personas" stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>CÉDULA</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>NOMBRES</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>APELLIDOS</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>FECHA INSCRIPCIÓN</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>FIN DE LA INSCRIPCIÓN</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>PESO (kg)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>PAGO</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Genero</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>ESTADO DE INSCRIPCIÓN</TableCell>
              <TableCell align="center" sx={{ width: '115px', fontWeight: 'bold' }}>Acciones</TableCell>
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
                personasFiltradas.map((persona) => (
                  <TableRow key={persona.id}>
                    <TableCell align="center" >{persona.cedula}</TableCell>
                    <TableCell align="center" >{persona.nombres}</TableCell>
                    <TableCell align="center" >{persona.apellidos}</TableCell>
                    <TableCell align="center" >
                      {persona.fechaInscripcion}
                    </TableCell>
                    <TableCell align="center">
                      {persona.fecha_fin_Inscripcion}
                    </TableCell>
                    <TableCell align="center">{persona.peso}</TableCell>
                    <TableCell align="center">${persona.suscripcion}</TableCell>
                    <TableCell align="center">{persona.genero.charAt(0).toUpperCase() + persona.genero.slice(1)}</TableCell>
                    <TableCell align="center">
                      {persona.estado_inscripcion === 1 ?
                        <Chip label="Activo" color="success" /> :
                        <Chip label="Caducado" color="error" />}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Eliminar datos" arrow placement="top">
                        <IconButton color="error" onClick={() => handleOpen(persona.cedula)}><DeleteIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Actualizar datos" arrow placement="top">
                        <IconButton color="warning" onClick={() => handleEditClick(persona)}><EditIcon /></IconButton>
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
            overflowY: "scroll",
            height: '80vh',
            width: '40vw',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6">Editar Persona</Typography>
            <TextField
              label="Cédula"
              value={selectedPersona?.cedula || ""}
              fullWidth
              required
              margin="normal"
              disabled
            />
            <Grid2 display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
              <Grid2 width={"50%"} minWidth={"190px"}>
                <TextField
                  label="Nombres"
                  value={selectedPersona?.nombres || ""}
                  fullWidth
                  required
                  margin="normal"
                  onChange={(e) => setSelectedPersona({ ...selectedPersona, nombres: e.target.value })}
                />
              </Grid2>
              <Grid2 width={"50%"} minWidth={"190px"}>
                <TextField
                  label="Apellidos"
                  value={selectedPersona?.apellidos || ""}
                  fullWidth
                  required
                  margin="normal"
                  onChange={(e) => setSelectedPersona({ ...selectedPersona, apellidos: e.target.value })}
                />
              </Grid2>
            </Grid2>
            <TextField
              label="Fecha Inscripción"
              type="date"
              value={selectedPersona?.fechaInscripcion || ""}
              fullWidth
              required
              margin="normal"
              onChange={(e) => setSelectedPersona({ ...selectedPersona, fechaInscripcion: e.target.value })}
            />

            <FormControl fullWidth >
              <InputLabel id="selectorTipo">Tipo de Inscripción</InputLabel>
              <Select
                labelId="selectorTipo"
                id="selector"
                required
                label="Tipo de Inscripcion"
                onChange={(e) =>
                  setSelectedPersona({ ...selectedPersona, tipoInscripcion: e.target.value })
                }
              >
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="quincenal">Quincenal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Fecha de Finalización"
              value={selectedPersona?.fecha_fin_Inscripcion || ""}
              onChange={(e) => setSelectedPersona({ ...selectedPersona, fecfecha_fin_Inscripcion: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"

              slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}

            />
            <TextField
              label="Peso (kg)"
              type="text"
              value={selectedPersona?.peso || ""}
              slotProps={{ htmlInput: { inputMode: "decimal" } }}
              fullWidth
              required
              margin="normal"
              onChange={(e) => {
                let value = e.target.value.replace(",", "."); 
                value = value.replace(/[^0-9.]/g, ""); 
                const parts = value.split(".");
                if (parts.length > 2) {
                  value = parts[0] + "." + parts.slice(1).join("");
                }
          
                setSelectedPersona({ ...selectedPersona, peso: value });
              }}
            />
            <TextField
              label="Suscripción"
              type="text"
              value={selectedPersona?.suscripcion || ""}
              slotProps={{ htmlInput: { inputMode: "decimal" } }}
              fullWidth
              required
              margin="normal"
              onChange={(e) => {
                let value = e.target.value.replace(",", ".");
                value = value.replace(/[^0-9.]/g, "");
                const parts = value.split(".");
                if (parts.length > 2) {
                  value = parts[0] + "." + parts.slice(1).join("");
                }
          
                setSelectedPersona({ ...selectedPersona, suscripcion: value });
              }}
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label" sx={{ color: "rgb(102, 102, 102)" }}>Genero</FormLabel>
              <RadioGroup
                sx={{ border: "solid", borderColor: "rgb(196, 196, 196)", borderRadius: "2%", borderWidth: "1px" }}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={selectedPersona?.genero}
                onChange={(e) => setSelectedPersona({ ...selectedPersona, genero: e.target.value })}
              >
                <FormControlLabel value="femenino" control={<Radio sx={{

                  '&.Mui-checked': {
                    color: "rgb(224, 108, 117)",
                  },
                }} />} label="Femenito" />
                <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                <FormControlLabel value="otro" control={<Radio color="default" />} label="Otro" />
              </RadioGroup>
            </FormControl>

            <Box display="flex" justifyContent="end" gap={2} mt={2}>
              <Tooltip title='Actualizar datos' arrow placement="top">
                <Button
                  variant="contained"
                  onClick={handleUpdatePersona}
                  disabled={actualozando}
                >{actualozando ? <CircularProgress size={25} color="inherit" /> : 'Actualizar'}</Button>
              </Tooltip>
              <Button color="error" variant="outlined" disabled={actualozando} onClick={() => setOpenEdit(false)}>Cancelar</Button>
            </Box>
          </Box>
        </Modal>
        <ModalEliminar
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => personaAEliminar && handleEliminarPersona(personaAEliminar)}
          itemName="esta persona"
          isloading={eliminando}
        />
      </TableContainer>

    </Card>
  );
};

export default PersonaTable;