
import { useQuery } from '@apollo/client';
import { GET_EMPTY, RESTAURANT } from '../utils/queries';
import { BarChart } from '@mui/x-charts';
import { Box, Typography } from '@mui/material';

export default function EmptyRecordsChart() {
  const { data: restaurantData } = useQuery(RESTAURANT);
  const restaurantId = restaurantData?.getRestaurant?._id;

  const { loading, error, data } = useQuery(GET_EMPTY, {
    variables: { restaurantId },
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const records = data?.getEmptyRecords || [];

  if (records.length === 0) {
    return <Typography>No records available.</Typography>;
  }

  // Prepare data for the first chart
  const chartData = records.flatMap((record) =>
    record.emptyBottles.map((bottle) => ({
      date: new Date(parseInt(record.date)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      liquorName: bottle.liquor.name,
      quantity: bottle.quantity,
    }))
  );

  // Extract unique liquor names for the x-axis
  const liquorNames = [...new Set(chartData.map((item) => item.liquorName))];

  // Aggregate quantities by liquor name
  const aggregatedData = liquorNames.map((name) => {
    const totalQuantity = chartData
      .filter((item) => item.liquorName === name)
      .reduce((sum, item) => sum + item.quantity, 0);
    return { liquorName: name, quantity: totalQuantity };
  });

  // Prepare data for the second chart (aggregated by month)
  const monthlyData = records.flatMap((record) =>
    record.emptyBottles.map((bottle) => {
      const date = new Date(parseInt(record.date));
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return {
        monthYear: `${month} ${year}`,
        liquorName: bottle.liquor.name,
        quantity: bottle.quantity,
      };
    })
  );

  // Extract unique months for the x-axis
  const months = [...new Set(monthlyData.map((item) => item.monthYear))];

  // Aggregate quantities by month and liquor name
  const monthlyAggregatedData = months.map((month) => {
    const liquorsInMonth = monthlyData.filter((item) => item.monthYear === month);
    const liquorQuantities = liquorNames.map((name) => {
      const totalQuantity = liquorsInMonth
        .filter((item) => item.liquorName === name)
        .reduce((sum, item) => sum + item.quantity, 0);
      return totalQuantity;
    });
    return { monthYear: month, quantities: liquorQuantities };
  });

  const categorizedMonthlyData = records.flatMap((record) =>
    record.emptyBottles.map((bottle) => {
      const date = new Date(parseInt(record.date));
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return {
        monthYear: `${month} ${year}`,
        category: bottle.liquor.category,
        quantity: bottle.quantity,
      };
    })
  );
  
  // Extract unique months for the x-axis
  const uniqueMonths = [...new Set(categorizedMonthlyData.map((item) => item.monthYear))];
  
  // Extract unique categories for the legend
  const uniqueCategories = [...new Set(categorizedMonthlyData.map((item) => item.category))];
  
  // Aggregate quantities by month and category
  const monthlyCategoryAggregatedData = uniqueMonths.map((month) => {
    const categoriesInMonth = categorizedMonthlyData.filter((item) => item.monthYear === month);
    const categoryQuantities = uniqueCategories.map((category) => {
      const totalQuantity = categoriesInMonth
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.quantity, 0);
      return totalQuantity;
    });
    return { monthYear: month, quantities: categoryQuantities };
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 400, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Empty Bottles by Liquor
        </Typography>
        <BarChart
          xAxis={[
            {
              label: 'Liquor Name',
              data: aggregatedData.map((item) => item.liquorName),
              scaleType: 'band',
            },
          ]}
          yAxis={[
            {
              label: 'Quantity',
            },
          ]}
          series={[
            {
              data: aggregatedData.map((item) => item.quantity),
              label: 'Quantity',
            },
          ]}
          width={800}
          height={400}
        />
      </Box>

      <Box sx={{ height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Liquor Consumption
        </Typography>
        <BarChart
          xAxis={[
            {
              label: 'Month',
              data: months,
              scaleType: 'band',
            },
          ]}
          yAxis={[
            {
              label: 'Quantity',
            },
          ]}
          series={liquorNames.map((name, index) => ({
            data: monthlyAggregatedData.map((item) => item.quantities[index]),
            label: name,
          }))}
          width={800}
          height={400}
        />
      </Box>
      <Box sx={{ height: 400, marginTop: 4 }}>
  <Typography variant="h6" gutterBottom>
    Monthly Liquor Consumption by Category
  </Typography>
  <BarChart
    xAxis={[
      {
        label: 'Month',
        data: uniqueMonths,
        scaleType: 'band',
      },
    ]}
    yAxis={[
      {
        label: 'Quantity',
      },
    ]}
    series={uniqueCategories.map((category, index) => ({
      data: monthlyCategoryAggregatedData.map((item) => item.quantities[index]),
      label: category,
      stack: 'total', // This property ensures the bars are stacked
    }))}
    width={800}
    height={400}
  />
</Box>
    </Box>
  );
}