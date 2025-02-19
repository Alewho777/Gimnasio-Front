import { useEffect, useState } from "react";
import { Button, TextField, Alert, Grid2, Card, Typography, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Divider, Tooltip, InputLabel, MenuItem, Select, CircularProgress } from '@mui/material';
import { createPersona } from "../assets/services/personaService";
import { toast, Toaster } from "mui-sonner";
import { Link } from "react-router-dom";
import { PersonAdd } from "@mui/icons-material";
import { Reply } from "@mui/icons-material";
import dayjs from "dayjs";
import { validarCedulaEcu } from "../assets/services/validar-cedula";

const PersonaForm = () => {

  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    fechaInscripcion: "",
    fecha_fin_Inscripcion: "",
    peso: "",
    suscripcion: "",
    genero: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tipoInscripcion, setTipoInscripcion] = useState<"semanal" | "quincenal" | "mensual">("mensual");

  const calcularFechaFin = (fechaInicio: string, tipo: string) => {
    const fecha = new Date(fechaInicio);
    if (isNaN(fecha.getTime())) return "";

    switch (tipo) {
      case "dia":
        fecha.setDate(fecha.getDate());
        break;
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
    if (formData.fechaInscripcion) {
      const nuevaFechaFin = calcularFechaFin(formData.fechaInscripcion, tipoInscripcion);
      setFormData(prev => ({ ...prev, fecha_fin_Inscripcion: nuevaFechaFin }));
    }
  }, [formData.fechaInscripcion, tipoInscripcion]);

  const verificarEstadoInscripcion = (fechaFin: string) => {

    if (!fechaFin) return 1;
    const hoy = dayjs();
    const fechaFinDayjs = dayjs(fechaFin);
    return hoy.isAfter(fechaFinDayjs) ? 2 : 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!validarCedulaEcu(formData.cedula)) {
      toast.error("Cédula invalida. Verifique sus credenciales");
      setLoading(false);
      return;
    }

    if (!formData.fechaInscripcion || !formData.fecha_fin_Inscripcion) {
      toast.error("Debe seleccionar una fecha de inscripción válida");
      return;
    }

    try {

      const nuevaPersona = {
        ...formData,
        peso: parseFloat(formData.peso),
        suscripcion: parseFloat(formData.suscripcion),
        estado_inscripcion: verificarEstadoInscripcion(formData.fecha_fin_Inscripcion),
      };

      const personaCreada = await createPersona(nuevaPersona);

      if (personaCreada) {

        setFormData({
          cedula: "",
          nombres: "",
          apellidos: "",
          fechaInscripcion: "",
          fecha_fin_Inscripcion: "",
          peso: "",
          suscripcion: "",
          genero: "",
        });
        toast.success(`${personaCreada.nombres} ${personaCreada.apellidos} registrado exitosamente`);
      }
    } catch (err) {
      setError("Error al crear la persona");
      toast.error("Error al registrar al cliente...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster duration={2000} />
      <Card sx={{
        width: "80%",
        height: "clamp(80%, 40vh, 100rem)",
        margin: "auto",
        alignItems: "center"
      }}>
        <Typography fontSize={'clamp(1rem, 3.5vw, 3rem)'}>REGISTRO DE CLIENTES</Typography>
        <Tooltip title="Regresar a la pagina anterior" arrow placement="bottom">
          <Button size="small" component={Link}
            to="/personas"
            variant="outlined"
            endIcon={<Reply />}
            sx={{ mt: 2 }}>Regresar</Button>
        </Tooltip>
        <Divider />

        <CardContent >
          <Grid2 container spacing={2} display={"grid"} gridTemplateColumns={"repeat(1  , minmax(200px, 1fr))"} width={"100%"}  >

            <Grid2 >
              <TextField
                name="cedula"
                label="Cédula"
                fullWidth
                value={formData.cedula}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, cedula: value })
                }}
                required
                slotProps={{ htmlInput: { maxLength: 10 } }}
                variant="outlined"
              />
            </Grid2>
            <Grid2 display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
              <Grid2 width={"50%"} minWidth={"190px"}>
                <TextField
                  name="nombres"
                  label="Nombres"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid2>

              <Grid2 width={"50%"} minWidth={"190px"}>
                <TextField
                  name="apellidos"
                  label="Apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid2>
            </Grid2>
            <Grid2>
              <TextField
                type="date"
                name="fechaInscripcion"
                label="Fecha de Inscripción"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.fechaInscripcion}
                onChange={(e) => setFormData({ ...formData, fechaInscripcion: e.target.value })}
                required
                fullWidth
                variant="outlined"
              />
            </Grid2>
            <Grid2>
              <FormControl fullWidth>
                <InputLabel id="selectorTipo">Tipo de Inscripción</InputLabel>
                <Select
                  labelId="selectorTipo"
                  id="selector"
                  required
                  onChange={(e) => setTipoInscripcion(e.target.value as any)}
                  label="Tipo de Inscripción"
                >
                  <MenuItem value="dia">Día</MenuItem>
                  <MenuItem value="semanal">Semanal (7 días)</MenuItem>
                  <MenuItem value="quincenal">Quincenal (15 días)</MenuItem>
                  <MenuItem value="mensual">Mensual (30 días)</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2>
              <TextField
                type="date"
                name="fecha_fin_Inscripcion"
                label="Fecha de Finalización"

                value={formData.fecha_fin_Inscripcion}

                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                fullWidth
                variant="outlined"
              />
            </Grid2>
            <Grid2>
              <TextField
                type="number"
                name="peso"
                label="Peso (kg)"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}

                slotProps={{ htmlInput: { step: "0.1", min: 1 } }}
                required
                fullWidth
                variant="outlined"
              />

            </Grid2>
            <Grid2>
              <TextField
                type="number"
                name="suscripcion"
                label="Pago"
                value={formData.suscripcion}
                onChange={(e) => setFormData({ ...formData, suscripcion: e.target.value })}

                slotProps={{ htmlInput: { step: "0.1", min: 1 } }}
                required
                fullWidth
                variant="outlined"
              />
            </Grid2>

            <Grid2>
              <FormControl >
                <FormLabel id="demo-row-radio-buttons-group-label">Genero</FormLabel>
                <RadioGroup
                  sx={{ border: "solid", borderColor: "rgb(196, 196, 196)", borderRadius: "2%", borderWidth: "1px" }}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                >
                  <FormControlLabel value="femenino" control={<Radio sx={{

                    '&.Mui-checked': {
                      color: "rgb(224, 108, 117)",
                    },
                  }}
                  />} label="Femenito" />
                  <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                  <FormControlLabel value="otro" control={<Radio color="default" />} label="Otro" />
                </RadioGroup>
              </FormControl>
            </Grid2>

            {error && <Alert severity="error">{error}</Alert>}
            <Grid2 display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
              <Tooltip title="Registrar persona" arrow placement="bottom">

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={!loading && <PersonAdd />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
                </Button>
              </Tooltip>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </form>
  );
};

export default PersonaForm;