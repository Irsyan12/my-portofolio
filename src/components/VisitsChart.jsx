import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisitsChart = ({ visitsData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    counts: [],
  });

  useEffect(() => {
    if (!visitsData || visitsData.length === 0) {
      setChartData({ labels: [], counts: [] });
      return;
    }

    // Process MongoDB analytics data
    // Expected format: [{ _id: "2024-01-15", count: 25 }, ...]
    const labels = visitsData.map((item) => {
      const date = new Date(item._id);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

    const counts = visitsData.map((item) => item.count);

    setChartData({ labels, counts });
  }, [visitsData]);

  // Format data for chart
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Daily Visits",
        data: chartData.counts,
        borderColor: "#c5f82a",
        backgroundColor: "rgba(197, 248, 42, 0.1)",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#fff" },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#fff",
        },
        ticks: {
          color: "#fff",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Visits",
          color: "#fff",
        },
        ticks: {
          color: "#fff",
          precision: 0,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="bg-[#18181b] border border-gray-800 p-6 rounded-lg">
      <h2 className="text-color1 text-xl font-semibold mb-4">
        Website Visits (Last 30 Days)
      </h2>
      {chartData.labels.length > 0 ? (
        <div className="relative h-[300px] md:h-[400px]">
          <Line data={data} options={options} />
        </div>
      ) : (
        <p className="text-gray-400">No visit data available</p>
      )}
    </div>
  );
};

export default VisitsChart;
