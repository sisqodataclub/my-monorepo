import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import type { RevenueDataPoint } from '../mockData';

interface RevenueChartMUIProps {
  data?: RevenueDataPoint[];
  title?: string;
  height?: number;
}

export default function RevenueChartMUI({
  data = [],
  title = 'Revenue Trend',
  height = 300,
}: RevenueChartMUIProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        }
        sx={{
          pb: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                activeDot={{ r: 8, fill: theme.palette.primary.main }}
                dot={{ r: 4, fill: theme.palette.primary.main }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
