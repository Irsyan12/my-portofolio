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

const VisitsChart = ({ timestamps }) => {
  const [processedData, setProcessedData] = useState({ labels: [], counts: [] });

  useEffect(() => {
    if (!timestamps || timestamps.length === 0) return;

    // Convert Firestore timestamps to JavaScript Date objects
    const dates = timestamps.map(timestamp => {
      // Handle both Firestore Timestamp objects and serialized timestamps
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
      } else if (timestamp.toDate) {
        return timestamp.toDate();
      } else {
        return new Date(timestamp);
      }
    });

    // Sort dates from oldest to newest
    dates.sort((a, b) => a - b);

    // Group by day for a cleaner visualization
    const visitsByDay = {};
    dates.forEach(date => {
      const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      visitsByDay[day] = (visitsByDay[day] || 0) + 1;
    });

    // Create arrays for chart
    const labels = Object.keys(visitsByDay);
    const counts = Object.values(visitsByDay);

    // Cumulative count for total visits over time
    let cumulativeCounts = [];
    let total = 0;
    counts.forEach(count => {
      total += count;
      cumulativeCounts.push(total);
    });

    setProcessedData({
      labels: labels.map(date => new Date(date).toLocaleDateString()),
      counts: cumulativeCounts
    });
  }, [timestamps]);

  // Format data for chart
  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: "Cumulative Website Visits",
        data: processedData.counts,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#fff"
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Total Visits: ${context.raw}`;
          }
        }
      }
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
          minRotation: 45
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Visits",
          color: "#fff",
        },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-lg col-span-1 md:col-span-2">
      <h2 className="text-color1 text-xl font-semibold mb-4">
        Website Visit Chart
      </h2>
      {processedData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p className="text-gray-300">Loading chart data...</p>
      )}
    </div>
  );
};

export default VisitsChart;