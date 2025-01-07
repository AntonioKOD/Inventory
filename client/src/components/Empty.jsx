import { useMutation, useQuery } from "@apollo/client"
import { EMPTY_BOTTLES } from "../utils/mutations"
import { GET_LIQUORS } from "../utils/queries"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button
  } from '@mui/material';



export default function Empty(){
    const {loading,error,data} = useQuery(GET_LIQUORS)
    const [bottles, setBottles] = useState({})
    const [emptyBottles] = useMutation(EMPTY_BOTTLES)
   

    if(loading) return <h1>Loading</h1>
    if(error) return <h1>{error.message}</h1>
    
    const liquors = data?.getLiquors;

    
    const handleChange = async(id, value)=> {
      
        setBottles({...bottles, [id]: value})
        
    }

    const handleSubmit = async ()=> {
        const inputArray = Object.entries(bottles).map(([id,emptyBottles])=> ({
            liquorId: id,
            emptyBottles: parseInt(emptyBottles, 10)
        }));
        try{
            const {data} = await emptyBottles({variables: {input: inputArray}})
            console.log(data)
            setBottles({})
        }catch(err){
            console.log(err)
        }
    }
    return(
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Liquor Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Empty Bottles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {liquors.map((liquor)=> (
                            <TableRow key={liquor._id}>
                            <TableCell>{liquor.name}</TableCell>
                            <TableCell>{liquor.category}</TableCell>
                            <TextField 
                                type="number"
                                value={bottles[liquor._id] || ""}
                                onChange={(e)=> handleChange(liquor._id, e.target.value)}
                                inputProps={{min: 0}}

                                
                            />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{marginTop: '1rem'}}>Submit Empty Bottles</Button>
        </>
    )
}