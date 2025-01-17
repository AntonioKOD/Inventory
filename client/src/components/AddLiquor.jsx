import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"; // Corrected Grid import
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_LIQUOR } from "../utils/mutations";
import { RESTAURANT } from "../utils/queries";



export default function AddLiquor(){

    const {data} = useQuery(RESTAURANT)
    const restaurantId = data?.getRestaurant?._id

    const[formData, setFormData] = useState({
        category: '',
        name: '',
        price: '',
        stock: '',
    })

    const [newLiquor] = useMutation(ADD_LIQUOR)

    const handleChange = async(e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = async(e)=> {
        e.preventDefault()

        try{
            const {data} = await newLiquor({
                variables: 
                {
                    input: {
                    category: formData.category,
                    name: formData.name,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    },
                    restaurantId
                }
            })
            console.log("Liquor created", data)
            setFormData({
                category: '',
                name: '',
                price: '',
                stock: ''
            })
        }catch(err){
            console.log(err)
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
        Add a Liquor
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
                    id="category"
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        required
                        fullWidth
                        id='name'
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        required
                        fullWidth
                        id='stock'
                        label="Stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item size={4}>
                    <TextField
                        required
                        fullWidth
                        id='price'
                        label="Price"
                        name='price'
                        value={formData.price}
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
                Add Liquor
            </Button>
            </Box>
            </Paper>
            </Container>
    )
}