import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import LiquorIcon from "@mui/icons-material/Liquor";
import { ME } from '../utils/queries';
import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';


export default function Home() {
  const { loading, error, data } = useQuery(ME, {
    skip: !Auth.loggedIn(),
  });
  const user = data?.me || null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading user data</p>;

  const isPirjen = user?.username === 'Pirjen'; // Check if the logged-in user is "Pirjen"

  return (
    <>
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Conditional Greeting */}
        {user ? (
          <Typography variant="h2" component="h1" gutterBottom color="primary.main">
            {isPirjen ? 'Sheno shpejt, mer Pederast' : `Welcome back, ${user.username}`}
          </Typography>
        ) : (
          <Typography variant="h2" component="h1" gutterBottom color="primary.main">
            Welcome to Inventory App
          </Typography>
        )}
        <Typography variant="h2" component="h1" gutterBottom color="primary.main">
          Manage Your Liquor Inventory with Ease
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Keep track of your stock, monitor sales, and streamline your liquor inventory management in one place.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          startIcon={<AddShoppingCartIcon />}
        >
          Get Started
        </Button>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }} color="primary">
          Key Features
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Feature 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 4,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <IconButton sx={{ fontSize: 40, color: 'primary.main' }}>
                  <InventoryIcon fontSize="inherit" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Track Inventory
                </Typography>
                <Typography color="text.secondary">
                  Monitor stock levels, update inventory, and get real-time insights on your liquor inventory.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 4,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <IconButton sx={{ fontSize: 40, color: 'secondary.main' }}>
                  <LiquorIcon fontSize="inherit" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Manage Liquor Categories
                </Typography>
                <Typography color="text.secondary">
                  Organize your stock into categories for better management and faster access.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 4,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <IconButton sx={{ fontSize: 40, color: 'success.main' }}>
                  <AddShoppingCartIcon fontSize="inherit" />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  Simplify Purchases
                </Typography>
                <Typography color="text.secondary">
                  Record purchase orders, restock with ease, and track supplier details efficiently.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.default',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Liquor Inventory App. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}