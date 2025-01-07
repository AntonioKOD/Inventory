import { TextField, Box, Container, Paper, Typography, Button } from "@mui/material";
import { CREATE_USER } from "../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import Grid from '@mui/material/Grid2'
import {RESTAURANT} from '../utils/queries'


export default function AddManager(){
    const [newUser] = useMutation(CREATE_USER)
    const {data} = useQuery(RESTAURANT)
    const restaurantId = data?.getRestaurant?._id
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
    })

    const handleChange = async (e)=> {
        const {name, value} = e.target;
        setFormData((prev)=> ({
            ...prev,
            [name]: value
        }))

    }

    const handleSubmit = async(e)=> {
        e.preventDefault()

        try{
            const {data} = await newUser({
                variables: {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    restaurantId
                }
            })

            console.log('User created', data)

            setFormData({
                username: '',
                email: '',
                password: '',
                role: '',
            })

        }catch(err){
            console.log('Something went wrong', err.message)
        }


    }
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
      <Typography component="h1" variant="h5">
        Add a Manager
      </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            width: '100%',
          }}
          >
            <Grid container spacing={2} columns={1}>
                <Grid item size={4}>
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
                <Grid item size={4}>
                    <TextField
                        required
                        fullWidth
                        id='email'
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        required
                        fullWidth
                        id='password'
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        required
                        fullWidth
                        id='role'
                        label="Role"
                        name='role'
                        value={formData.role}
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
                Add Manager
            </Button>
            </Box>
            </Paper>
            </Container>
        
    )
}