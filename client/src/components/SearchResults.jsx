import { useQuery, useMutation } from "@apollo/client";
import { GET_LIQUOR, RESTAURANT, ME } from "../utils/queries"; // Import ME query
import { UPDATE_STOCK, ADD_SINGLE_EMPTY_BOTTLE } from "../utils/mutations"; // Import the mutation for empty bottles
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

    // Fetch the restaurant and user data
    const { data: restaurantData } = useQuery(RESTAURANT);
    const { data: userData } = useQuery(ME); // Fetch user data
    const restaurantId = restaurantData?.getRestaurant?._id;
    const userRole = userData?.me?.role;

    const { loading, error, data } = useQuery(GET_LIQUOR, {
        variables: {
            searchTerm: query,
            restaurantId,
        },
    });

    // State for empty bottle update
    const [emptyBottle, setEmptyBottle] = useState({
        liquorId: '',
        emptyBottles: '',
    });

    // State for stock update
    const [stock, setStock] = useState({
        stock: '',
        liquorId: '',
    });

    const [updateStock] = useMutation(UPDATE_STOCK);
    const [updateEmptyBottle] = useMutation(ADD_SINGLE_EMPTY_BOTTLE);

    const handleChangeEmptyBottle = (e, liquorId) => {
        setEmptyBottle({
            ...emptyBottle,
            emptyBottles: e.target.value,
            liquorId,
        });
    };

    const handleChangeStock = (e, liquorId) => {
        setStock({
            ...stock,
            stock: e.target.value,
            liquorId,
        });
    };

    const handleSubmitEmptyBottle = async (e) => {
        e.preventDefault();

        if (!emptyBottle.liquorId || !emptyBottle.emptyBottles) {
            throw new Error('Liquor ID or empty bottle count missing');
        }

        try {
            const { data } = await updateEmptyBottle({
                variables: {
                    liquorId: emptyBottle.liquorId,
                    emptyBottles: parseInt(emptyBottle.emptyBottles, 10), // Add multiple bottles
                    restaurantId,
                },
            });
            console.log('Empty bottle record updated successfully', data);
            // Clear the state after update
            setEmptyBottle({ liquorId: '', emptyBottles: '' });
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSubmitStock = async (e) => {
        e.preventDefault();

        if (!stock.liquorId || !stock.stock) {
            throw new Error('Liquor ID or stock value missing');
        }

        try {
            const { data } = await updateStock({
                variables: {
                    stock: parseInt(stock.stock, 10),
                    id: stock.liquorId,
                },
            });
            console.log('Stock updated successfully', data);
            // Clear the state after update
            setStock({ liquorId: '', stock: '' });
        } catch (err) {
            console.log(err.message);
        }
    };

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

                                {/* Form for updating empty bottles */}
                                <Box sx={{ marginTop: "1rem" }}>
                                    <TextField
                                        type="number"
                                        label="Empty Bottles"
                                        variant="outlined"
                                        size="small"
                                        value={liquor._id === emptyBottle.liquorId ? emptyBottle.emptyBottles : ''}
                                        onChange={(e) => handleChangeEmptyBottle(e, liquor._id)}
                                        sx={{ marginBottom: "0.5rem", width: "100%" }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleSubmitEmptyBottle}
                                        disabled={!emptyBottle.emptyBottles || emptyBottle.liquorId !== liquor._id}
                                    >
                                        Add Empty Bottles
                                    </Button>
                                </Box>

                                {/* Show stock update only for admin users */}
                                {userRole === 'admin' && (
                                    <Box sx={{ marginTop: "1rem" }}>
                                        <TextField
                                            type="number"
                                            label="Update Stock"
                                            variant="outlined"
                                            size="small"
                                            value={liquor._id === stock.liquorId ? stock.stock : ''}
                                            onChange={(e) => handleChangeStock(e, liquor._id)}
                                            sx={{ marginBottom: "0.5rem", width: "100%" }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmitStock}
                                            disabled={!stock.stock || stock.liquorId !== liquor._id}
                                        >
                                            Update Stock
                                        </Button>
                                    </Box>
                                )}
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