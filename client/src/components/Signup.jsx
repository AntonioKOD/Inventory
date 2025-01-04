import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Avatar,
  Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../utils/mutations';
import Auth from '../utils/auth'


export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    restaurantName: '',
    restaurantAddress: '',
    restaurantState: '',
  });

  const [registerUserAndRestaurant, { error, data }] = useMutation(REGISTER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await registerUserAndRestaurant({
        variables: {
          input: {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              name: formData.restaurantName,
              address: formData.restaurantAddress,
              state: formData.restaurantState,
          },
        },
      });
      Auth.login(data.registerUserAndRestaurant.token)

      setFormData({
        username: '',
        email: '',
        password: '',
        restaurantName: '',
        restaurantAddress: '',
        restaurantState: ''
      })

      console.log('Registration successful:', data);
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register User and Restaurant
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            width: '100%',
          }}
        >
          <Grid container spacing={2}>
            {/* User Details */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            {/* Restaurant Details */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="restaurantName"
                label="Restaurant Name"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="restaurantAddress"
                label="Restaurant Address"
                name="restaurantAddress"
                value={formData.restaurantAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="restaurantState"
                label="State"
                name="restaurantState"
                value={formData.restaurantState}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error.message}
        </Typography>
      )}
      {data && (
        <Typography color="primary" sx={{ mt: 2 }}>
          Registration successful! Welcome, {data.registerUserAndRestaurant.user.username}.
        </Typography>
      )}
    </Container>
  );
}