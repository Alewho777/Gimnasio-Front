import { useState } from "react";
import { createProducto } from "../assets/services/productoService";
import { toast, Toaster } from "mui-sonner";
import { AddBusiness, Reply } from "@mui/icons-material";
import { Card, Typography, Divider, CardContent, Grid2, TextField, Alert, Tooltip, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";


const ProductoForm = () => {
    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        stock: "",
        precio: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const codigoGenerado = generarCodigoProducto(formData.nombre);
        try {
            const nuevoProducto = {
                ...formData,
                codigo: codigoGenerado,
                stock: parseFloat(formData.stock),
                precio: parseFloat(formData.precio),
            };

            const productoCreado = await createProducto(nuevoProducto);

            if (productoCreado) {
                setFormData({
                    codigo: "",
                    nombre: "",
                    stock: "",
                    precio: "",
                });
                toast.success(`Producto ${productoCreado.nombre} registrado con ÉXITO`);
            }
        } catch (err) {
            setError("Error al registrar el producto");
            toast.error("Error...");
        } finally {
            setLoading(false);
        }
    };

    const generarCodigoProducto = (nombre: string): string => {
        if (!nombre) return "";
        const letras = nombre.substring(0, 4).toUpperCase().padEnd(4, "X");
        const numero = Math.floor(Math.random() * 9999) + 1;
        const numeroFormateado = numero.toString().padStart(4, "0");
        return `${letras}${numeroFormateado}`;
    };


    return (
        <form onSubmit={handleSubmit}>
            <Toaster duration={2000} />
            <Card sx={{
                width: "80%",
                height: "clamp(80%, 40vw, 100rem)",
                margin: "auto",
                alignItems: "center"
            }}>
                <Typography fontSize={'clamp(1rem, 3.5vw, 3rem)'} sx={{cursor: 'default'}}>REGISTRO DE PRODUCTOS</Typography>
                <Divider />

                <CardContent >
                    <Grid2 container spacing={2} display={"grid"} gridTemplateColumns={"repeat(1  , minmax(200px, 1fr))"} width={"100%"}  >

                        <Grid2 >
                            <Tooltip title="El código se genera automáticamente" arrow placement="top" followCursor>
                                <TextField
                                    name="codigo"
                                    label="Código"
                                    fullWidth
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                    disabled
                                    variant="outlined"
                                />
                            </Tooltip>
                        </Grid2>
                        <Grid2 >
                            <TextField
                                name="nombre"
                                label="Nombre del Producto"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </Grid2>

                        <Grid2 >
                            <TextField
                                type="text"
                                name="stock"
                                label="Stock"
                                value={formData.stock}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "");
                                    setFormData({ ...formData, stock: value });
                                }}
                                slotProps={{ htmlInput: { inputMode: "numeric", } }}
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </Grid2>
                        <Grid2>
                            <TextField
                                type="text"
                                name="precio"
                                label="Precio"
                                value={formData.precio}
                                onChange={(e) => {
                                    let value = e.target.value.replace(",", ".");
                                    value = value.replace(/[^0-9.]/g, "");
                                    const parts = value.split(".");
                                    if (parts.length > 2) {
                                        value = parts[0] + "." + parts.slice(1).join("");
                                    }

                                    setFormData({ ...formData, precio: value });
                                }}
                                slotProps={{ htmlInput: { inputMode: "decimal" } }}
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </Grid2>


                        {error && <Alert severity="error">{error}</Alert>}
                        <Grid2 display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
                            <Tooltip title="Resgistrar producto" arrow placement="bottom">

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    endIcon={loading && <AddBusiness />}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={25} color="inherit" /> : 'Registrar'}
                                </Button>
                            </Tooltip>
                            <Tooltip title="Regresar a la pagina anterior" arrow placement="bottom">
                                <Button size="small" component={Link}
                                    to="/productos"
                                    variant="outlined"
                                    endIcon={<Reply />}
                                    sx={{ mt: 2 }}>Regresar</Button>
                            </Tooltip>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </form>
    );
};

export default ProductoForm;