import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-cname",
      closeBundle() {
        copyFileSync("CNAME", "dist/CNAME");
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "vendor-mui";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (
              id.includes("chart.js") ||
              id.includes("react-chartjs-2") ||
              id.includes("react-github-calendar")
            ) {
              return "vendor-charts";
            }
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("react-markdown")) {
              return "vendor-markdown";
            }
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-react";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
