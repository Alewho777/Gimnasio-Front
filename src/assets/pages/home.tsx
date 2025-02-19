import { Box, CircularProgress, Container, Grid2, Typography } from '@mui/material';
import { getPersonas } from '../services/personaService';
import { useEffect, useState } from 'react';
import { getProductos } from '../services/productoService';
import { getVentas } from '../services/ventasService';
import StatCard from '../../hooks/EarningCard';
import { Person as PersonaIcon, Inventory2, Storefront, EventAvailable, EventBusy } from '@mui/icons-material';
import dayjs from 'dayjs';
import fondoGYM from "../images/fondoGYM.jpg"

const Home = () => {


  const [numeroPersonas, setNumeroPersonas] = useState(0);
  const [numeroProductos, setNumeroProdcutos] = useState(0);
  const [numeroVentas, setNumeroVentas] = useState(0);
  const [personasInscritas, setPersonasInscritas] = useState(0);
  const [personasNoInscritas, setPersonasNoInscritas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personas = await getPersonas();

        const personasFiltradas = personas.filter(
          (personas) => personas.estado == 1);
        setNumeroPersonas(personasFiltradas.length);

        const inscripciones = personasFiltradas.filter(
          (personas) => personas.estado_inscripcion == 1).length;
        setPersonasInscritas(inscripciones);

        const Noinscripciones = personasFiltradas.filter(
          (personas) => personas.estado_inscripcion == 2).length;
        setPersonasNoInscritas(Noinscripciones);

        const productos = await getProductos();

        const productosFiltrados = productos.filter(
          (productos) => productos.estado == 1);

        setNumeroProdcutos(productosFiltrados.length);

        const ventas = await getVentas();

        const hoy = dayjs();

        const ventasMensual = ventas.filter((venta) => {
          return dayjs(venta.fechaVenta).isSame(hoy, 'month');
        });

        setNumeroVentas(ventasMensual.length);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setNumeroPersonas(0);
        setNumeroProdcutos(0);
        setNumeroVentas(0);
        setPersonasInscritas(0);
        setPersonasNoInscritas(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <Container maxWidth="lg" sx={{
      textAlign: 'center',
      py: 4,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    }}>



      <Grid2 container sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(200px, 1fr))',
        columnGap: '1px',
        rowGap: '20px',
      }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: '5px',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${fondoGYM})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px) brightness(70%)',
              zIndex: 1,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(70, 70, 70, 0.16) 30%, rgba(93, 93, 93, 0.64) 90%)',

              zIndex: 2,
            }}
          />

          <Typography fontSize={'clamp(1.5rem, 3vw, 3rem)'} sx={{ zIndex: 3, color: 'white' }}>
            GESTION DE GIMNASIO
          </Typography>
        </Box>
        <Grid2 display={'flex'}>
          <Typography fontSize={'clamp(1.5rem, 2.5vw, 3rem)'}>

            CONTROL DE PERSONAS
          </Typography>
        </Grid2>
        <Grid2 display={'flex'} flexWrap={'wrap'} columnGap={10} rowGap={3}>

          <StatCard
            backgroundcolor='linear-gradient(135deg,rgb(45, 74, 190) 30%,rgb(51, 101, 217) 90%)'
            title='Personas'
            value={loading ? <CircularProgress size={24} color="inherit" /> : numeroPersonas}
            icon={<PersonaIcon />}
            colorForent='#fff'
            iconColor='rgba(255, 255, 255, 0.2)'
            width='320px'
            subtitle='Clientes registrados'
          />



          <StatCard
            backgroundcolor='linear-gradient(135deg, rgb(45, 190, 69) 30%,rgb(51, 217, 62) 90%)'
            title='Inscripciones'
            value={loading ? <CircularProgress size={24} color="inherit" /> : personasInscritas}
            icon={<EventAvailable />}
            colorForent='#fff'
            iconColor='rgba(255, 255, 255, 0.2)'
            width='320px'
            subtitle='Inscripciones activas'
          />
          <StatCard
            backgroundcolor='linear-gradient(135deg, rgb(190, 45, 45) 30%,rgb(217, 51, 51) 90%)'
            title='Inscripciones'
            value={loading ? <CircularProgress size={24} color="inherit" /> : personasNoInscritas}
            icon={<EventBusy />}
            colorForent='#fff'
            iconColor='rgba(255, 255, 255, 0.2)'
            width='320px'
            subtitle='Inscripciones caducadas'
          />
        </Grid2>
        <Grid2 display={'flex'}>
          <Typography fontSize={'clamp(1.5rem, 2.5vw, 3rem)'}>
            CONTROL DE PRODUCTOS
          </Typography>
        </Grid2>
        <Grid2 display={'flex'} flexWrap='wrap' columnGap={10} rowGap={3}>

          <StatCard
            backgroundcolor='linear-gradient(135deg, rgb(90, 45, 190) 30%, #7633D9 90%)'
            title='Productos'
            value={loading ? <CircularProgress size={24} color="inherit" /> : numeroProductos}
            icon={<Inventory2 />}
            colorForent='#fff'
            iconColor='rgba(255, 255, 255, 0.2)'
            width='320px'
            subtitle='Cantidad de productos actuales'
          />

          <StatCard
            backgroundcolor='linear-gradient(135deg,rgb(45, 190, 190) 30%,rgb(51, 206, 217) 90%)'
            title='Ventas'
            value={loading ? <CircularProgress size={24} color="inherit" /> : numeroVentas}
            icon={<Storefront />}
            colorForent='#fff'
            iconColor='rgba(255, 255, 255, 0.2)'
            width='320px'
            subtitle='Ventas de este mes'
          />
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Home;