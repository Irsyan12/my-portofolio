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
  const [processedData, setProcessedData] = useState({
    labels: [],
    counts: [],
  });
  const [selectedRange, setSelectedRange] = useState(7); // Default to 7 days

  useEffect(() => {
    if (!timestamps || timestamps.length === 0) {
      setProcessedData({ labels: [], counts: [] }); // Clear data if no timestamps
      return;
    }

    // Convert Firestore timestamps to JavaScript Date objects
    let dates = timestamps.map((timestamp) => {
      // Handle both Firestore Timestamp objects and serialized timestamps
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
      } else if (timestamp.toDate) {
        return timestamp.toDate();
      } else {
        return new Date(timestamp);
      }
    });

    // Filter dates based on selectedRange
    if (selectedRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - selectedRange);

      dates = dates.filter((date) => date >= cutoffDate);
    }

    if (dates.length === 0) {
      // If no data after filtering
      setProcessedData({ labels: [], counts: [] });
      return;
    }

    // Sort dates from oldest to newest
    dates.sort((a, b) => a - b);

    // Group by day for a cleaner visualization
    const visitsByDay = {};
    dates.forEach((date) => {
      const day = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      visitsByDay[day] = (visitsByDay[day] || 0) + 1;
    });

    // Create arrays for chart
    const labels = Object.keys(visitsByDay);
    const counts = Object.values(visitsByDay);

    // Cumulative count for total visits over time
    let cumulativeCounts = [];
    let total = 0;
    counts.forEach((count) => {
      total += count;
      cumulativeCounts.push(total);
    });

    setProcessedData({
      labels: labels.map((date) => new Date(date).toLocaleDateString()),
      counts: cumulativeCounts,
    });
  }, [timestamps, selectedRange]); // Add selectedRange to dependencies

  const handleRangeChange = (event) => {
    const value = event.target.value;
    setSelectedRange(value === "all" ? "all" : parseInt(value));
  };

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
          color: "#fff",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Total Visits: ${context.raw}`;
          },
        },
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-color1 text-xl font-semibold">
          Website Visit Chart
        </h2>
        <div>
          <label htmlFor="range-select" className="text-gray-300 mr-2">
            View:
          </label>
          <select
            id="range-select"
            value={selectedRange}
            onChange={handleRangeChange}
            className="bg-[#2a2a2a] text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-gray-400"
          >
            <option value="7">Last 7 Days</option>
            <option value="15">Last 15 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      {processedData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p className="text-gray-300">
          No data available for the selected period.
        </p>
      )}
    </div>
  );
};

export default VisitsChart;
