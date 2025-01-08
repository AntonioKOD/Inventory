import { LOGIN } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import Auth from "../utils/auth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


export default function Login(){
    const [formData, setFormData] = useState(
        {
            email: '',
            password: ''
        }
    )

    const [login] = useMutation(LOGIN);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev)=> ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();

        try{
            const {data} = await login({
                variables: {
                    email: formData.email,
                    password: formData.password
                }
            })

            Auth.login(data.login.token)
            setFormData({
                email: '',
                password: ''
            })
        }catch(err){
            console.error('Error during login', err.message)
        }
    }

    return(
        <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 300,
          margin: '0 auto',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Login
        </Button>
      </Box>
    )
}