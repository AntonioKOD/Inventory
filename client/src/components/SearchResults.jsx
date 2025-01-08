import { useQuery, useMutation } from "@apollo/client";
import { GET_LIQUOR, RESTAURANT } from "../utils/queries";
import { UPDATE_STOCK } from "../utils/mutations";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";


export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const { data: restaurantData } = useQuery(RESTAURANT);
    const restaurantId = restaurantData?.getRestaurant?._id;
    console.log(restaurantId)
    const { loading, error, data } = useQuery(GET_LIQUOR, {
        variables: {
            searchTerm: query,
            restaurantId
        },
    });
    const [stock, setStock] = useState({
        stock: '',
        liquorId: '',

    })
    const [updateStock] = useMutation(UPDATE_STOCK)
    const handleChange = (e, liquorId)=> {
        setStock({
            ...stock,
            stock:e.target.value,
            liquorId
        })
    }
    const handleSubmit = async(e)=> {
        e.preventDefault()

        if(!stock.liquorId){
            throw new Error('liquor id missing')
        }

        try{
            const {data} = await updateStock({
                variables: {
                    stock: parseInt(stock.stock ,10 ),
                    id: stock.liquorId
                }
            })
            console.log('Stock updated successfully', data)
        }catch(err){
            console.log(err.message)
        }
    }

    if (!query) return <Typography variant="h4">Please enter a liquor&apos;s name</Typography>;
    if (loading) return <Typography variant="h4">Loading...</Typography>;
    if (error) return <Typography variant="h4">{error.message}</Typography>;

    const liquors = data?.getLiquor || [];

    return (
        <Box sx={{ padding: "2rem" }}>
            <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
                Search Results for &apos;{query}&apos;
            </Typography>

            {liquors.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {liquors.map((liquor) => (
                        <Card key={liquor._id} sx={{ backgroundColor: "#f5f5f5", boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {liquor.name}
                                </Typography>
                                <Typography variant="body1">Stock: {liquor.stock}</Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    Category: {liquor.category || "N/A"}
                                </Typography>
                                <Box sx={{marginTop: '1rem'}}>
                                    <TextField
                                        type="number"
                                        label="Update Stock"
                                        variant="outlined"
                                        size="small"
                                        value={liquor._id === stock.liquorId ? stock.stock : ''}
                                        onChange={(e)=> handleChange(e, liquor._id)}
                                        sx={{marginBottom: '0.5rem', width: '100%'}}
                                    />
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={handleSubmit}
                                        disabled={!stock.stock || stock.liquorId !== liquor._id}
                                    >Update</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography variant="h6">No results found for &apos;{query}&apos;.</Typography>
            )}
        </Box>
    );
}