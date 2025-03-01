
import { Link } from "react-router-dom";
import { Button, Container, Typography, Box, Paper, Card, CardActions, CardContent, CardMedia, Grid2, Tooltip } from '@mui/material';
import { ArrowForward } from "@mui/icons-material";
import personasCreate from "../images/personasCreate.jpg";
import personasGestion from "../images/personasGestion.jpg";
const PersonasControl = () => {

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', cursor: 'default' }}>
          Gestión de Personas
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}  >
        <Grid2 container display={"flex"} flexWrap={"wrap"} justifyContent={"space-around"}>
          <Card sx={{
            width: { xs: "90%", sm: "45%", md: "30vw" },
            height: { xs: 250, sm: 280, md: 320 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center"
          }}>
            <CardMedia
              component="img"
              sx={{ height: "60%", width: "100%", objectFit: "cover" }}
              image={personasCreate}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{cursor: 'default'}}>
                Registro
              </Typography>
            </CardContent>
            <CardActions >
              <Tooltip title="Ingresar al Registro de clientes" arrow placement="bottom">
                <Button size="small" component={Link}
                  to="/personas/crear"
                  variant="contained"
                  endIcon={<ArrowForward />}
                >Ingresar</Button>
              </Tooltip>
            </CardActions>
          </Card>

          <Card sx={{
            width: { xs: "90%", sm: "45%", md: "30vw" },
            height: { xs: 250, sm: 280, md: 320 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center"
          }}>
            <CardMedia
              component="img"
              sx={{ height: "60%", width: "100%", objectFit: "cover" }}
              image={personasGestion}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{cursor: 'default'}}>
                Gestion
              </Typography>
            </CardContent>
            <CardActions>
              <Tooltip title="Ingresar a la Gestion de clientes" arrow placement="bottom">
                <Button size="small" component={Link}
                  to="/personas/gestion"
                  variant="contained"
                  endIcon={<ArrowForward />}
                >Ingresar
                </Button>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default PersonasControl;