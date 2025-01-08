import { useQuery } from "@apollo/client";
import { GET_EMPTY, RESTAURANT } from "../utils/queries";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function EmptyRecords() {
  // Fetch restaurant data
  const { data: restaurantData } = useQuery(RESTAURANT);
  const restaurantId = restaurantData?.getRestaurant?._id;

  // Fetch empty records data
  const { loading, error, data } = useQuery(GET_EMPTY, {
    variables: { restaurantId },
    skip: !restaurantId, // Skip query if restaurantId is not available
  });

  // Memoize records to prevent unnecessary re-renders
  const records = data?.getEmptyRecords || [];

  // Handle loading and error states after all hooks are called
  if (loading) return <Typography variant="h4">Loading...</Typography>;
  if (error) return <Typography variant="h4">{error.message}</Typography>;

  return (
    <Container maxWidth={false} sx={{ padding: 2 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {records.map((record) => {
          // Convert the timestamp to a readable date
          const recordDate = new Date(parseInt(record.date)).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          return (
            <Card key={record._id} sx={{ width: "100%", maxWidth: 800 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Date: {recordDate}
                </Typography>
                <List>
                  {record.emptyBottles.map((bottle) => (
                    <ListItem key={bottle.liquor._id}>
                      <ListItemText
                        primary={bottle.liquor.name}
                        secondary={`Quantity: ${bottle.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
}