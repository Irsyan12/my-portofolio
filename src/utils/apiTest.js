// API Connection Test Utility
// Use this to debug API connection issues

export const testApiConnection = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  console.log("🧪 Testing API Connection...");
  console.log("📡 API URL:", apiUrl);

  try {
    // Test 1: Check if server is reachable
    console.log("\n1️⃣ Testing server health...");
    const healthResponse = await fetch("http://localhost:5000");
    const healthData = await healthResponse.json();
    console.log("✅ Server is reachable:", healthData);

    // Test 2: Test CORS
    console.log("\n2️⃣ Testing CORS...");
    const corsResponse = await fetch(`${apiUrl}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const corsData = await corsResponse.json();
    console.log("✅ CORS is working:", corsData);

    // Test 3: Test login endpoint
    console.log("\n3️⃣ Testing login endpoint...");
    const loginResponse = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@portfolio.com",
        password: "admin123",
      }),
    });
    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
      console.log("✅ Login endpoint working:", {
        success: loginData.success,
        user: loginData.data?.user?.email,
        hasToken: !!loginData.data?.token,
      });
    } else {
      console.log("❌ Login failed:", loginData);
    }

    console.log("\n✅ All tests passed! API is working correctly.");
    return true;
  } catch (error) {
    console.error("\n❌ API Connection Test Failed:");
    console.error("Error:", error.message);
    console.error("Details:", error);

    if (error.message === "Failed to fetch") {
      console.error("\n💡 Possible issues:");
      console.error(
        "  1. Backend server is not running (npm run dev in backend/)"
      );
      console.error("  2. Backend is running on different port");
      console.error("  3. CORS not configured properly");
      console.error("  4. Firewall blocking connection");
    }

    return false;
  }
};

// Run test on import in development
if (import.meta.env.DEV) {
  console.log("🔧 Development mode detected");
  console.log("Run testApiConnection() in console to test API");
}
