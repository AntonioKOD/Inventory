import { useMutation, useQuery } from "@apollo/client";
import { EMPTY_BOTTLES } from "../utils/mutations";
import { GET_LIQUORS, RESTAURANT } from "../utils/queries";
import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Empty() {
    // Fetch restaurant data
    const { data: restaurantData } = useQuery(RESTAURANT);
    const restaurantId = restaurantData?.getRestaurant?._id;

    // Fetch liquors data
    const { loading, error, data } = useQuery(GET_LIQUORS, {
        variables: { restaurantId },
        skip: !restaurantId, // Prevent query if restaurantId is not available
    });

    // State to manage bottle counts
    const [bottles, setBottles] = useState({});

    // Mutation to empty bottles
    const [emptyBottles] = useMutation(EMPTY_BOTTLES);

    // Memoize liquors to avoid recomputation
    const liquors = useMemo(() => data?.getLiquors || [], [data]);

    // Handlers
    const handleChange = (id, value) => {
        setBottles({ ...bottles, [id]: value });
    };

    const handleSubmit = async () => {
        const inputArray = Object.entries(bottles).map(([id, emptyBottles]) => ({
            liquorId: id,
            emptyBottles: parseInt(emptyBottles, 10),
        }));

        try {
            const { data } = await emptyBottles({
                variables: { input: inputArray, restaurantId },
            });
            console.log(data);
            setBottles({});
        } catch (err) {
            console.error(err);
        }
    };

    // Early returns for loading and error states after hooks initialization
    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>{error.message}</h1>;

    return (
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
                        {liquors.map((liquor) => (
                            <TableRow key={liquor._id}>
                                <TableCell>{liquor.name}</TableCell>
                                <TableCell>{liquor.category}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={bottles[liquor._id] || ""}
                                        onChange={(e) => handleChange(liquor._id, e.target.value)}
                                        inputProps={{ min: 0 }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: "1rem" }}
            >
                Submit Empty Bottles
            </Button>
        </>
    );
}