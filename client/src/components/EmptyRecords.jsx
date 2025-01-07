import { useQuery } from "@apollo/client";
import { GET_EMPTY, RESTAURANT } from "../utils/queries";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function EmptyRecords() {
  const { data: restaurantData } = useQuery(RESTAURANT);
  const restaurantId = restaurantData?.getRestaurant?._id;

  const { loading, error, data } = useQuery(GET_EMPTY, {
    variables: { restaurantId },
    
  });

  if (loading) return <Typography variant="h4">Loading...</Typography>;
  if (error) return <Typography variant="h4">{error.message}</Typography>;

  const records = data?.getEmptyRecords;

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
            <Card key={record._id} sx={{ width: '100%', maxWidth: 800 }}>
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