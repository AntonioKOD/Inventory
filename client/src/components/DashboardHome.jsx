import { memo, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { BarChart } from '@mui/x-charts';
import { GET_EMPTY, RESTAURANT } from '../utils/queries';

const DashboardHome = memo(function DashboardHome() {
  const { data: restaurantData } = useQuery(RESTAURANT);
  const restaurantId = restaurantData?.getRestaurant?._id;

  const { loading, error, data } = useQuery(GET_EMPTY, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  const records = useMemo(() => data?.getEmptyRecords || [], [data]);

  const aggregatedData = useMemo(() => {
    const liquorData = {};
    records.forEach((record) => {
      record.emptyBottles.forEach((bottle) => {
        liquorData[bottle.liquor.name] =
          (liquorData[bottle.liquor.name] || 0) + bottle.quantity;
      });
    });
    return Object.entries(liquorData).map(([liquorName, quantity]) => ({
      liquorName,
      quantity,
    }));
  }, [records]);

  const monthlyData = useMemo(() => {
    const monthData = {};
    records.forEach((record) => {
      const date = new Date(parseInt(record.date));
      const month = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
      record.emptyBottles.forEach((bottle) => {
        monthData[month] = monthData[month] || {};
        monthData[month][bottle.liquor.name] =
          (monthData[month][bottle.liquor.name] || 0) + bottle.quantity;
      });
    });

    const months = Object.keys(monthData);
    const liquorNames = Array.from(
      new Set(
        Object.values(monthData)
          .flatMap((liquor) => Object.keys(liquor))
          .sort()
      )
    );

    const chartData = months.map((month) =>
      liquorNames.map((name) => monthData[month][name] || 0)
    );

    return { months, liquorNames, chartData };
  }, [records]);

  const renderChart = (title, data, xAxisLabel, yAxisLabel, xAxisData, series) => (
    <Box sx={{ height: 400, marginBottom: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" width={800} height={400} />
      ) : error ? (
        <Typography color="error">{error.message}</Typography>
      ) : records.length === 0 ? (
        <Typography>No records available.</Typography>
      ) : (
        <BarChart
          xAxis={[
            {
              label: xAxisLabel,
              data: xAxisData,
              scaleType: 'band',
            },
          ]}
          yAxis={[
            {
              label: yAxisLabel,
            },
          ]}
          series={series}
          width={800}
          height={400}
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {renderChart(
        'Empty Bottles by Liquor',
        aggregatedData,
        'Liquor Name',
        'Quantity',
        aggregatedData.map((item) => item.liquorName),
        [
          {
            data: aggregatedData.map((item) => item.quantity),
            label: 'Quantity',
          },
        ]
      )}
      {renderChart(
        'Monthly Liquor Consumption',
        monthlyData.chartData,
        'Month',
        'Quantity',
        monthlyData.months,
        monthlyData.liquorNames.map((name, index) => ({
          data: monthlyData.chartData.map((month) => month[index]),
          label: name,
        }))
      )}
    </Box>
  );
});

export default DashboardHome;