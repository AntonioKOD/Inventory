import { useQuery } from "@apollo/client";
import { RESTAURANT } from "../utils/queries";
import { useEffect, useState } from "react";

export default function DashboardHome() {
    const { loading, error, data } = useQuery(RESTAURANT, {
        fetchPolicy: "network-only", 
      });
  const [restaurant, setRestaurant] = useState(null);

  // Update restaurant state when data changes
  useEffect(() => {
    if (data?.getRestaurant) {
      setRestaurant(data.getRestaurant);
    }
  }, [data]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h2>Error: {error.message}</h2>;

  if (!restaurant) return <h2>No restaurant data available</h2>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <h2>{restaurant.admin?.username || "Admin not found"}</h2>
      <h3>Managers:</h3>
      {restaurant.managers && restaurant.managers.length > 0 ? (
        restaurant.managers.map((manager) => (
          <h2 key={manager._id}>{manager.username}</h2>
        ))
      ) : (
        <p>No managers available</p>
      )}
      <h3>Liquors:</h3>
      {restaurant.liquors && restaurant.liquors.length > 0 ? (
        restaurant.liquors.map((liquor) => (
          <h2 key={liquor._id}>{liquor.name}</h2>
        ))
      ) : (
        <p>No liquors available</p>
      )}
    </div>
  );
}
