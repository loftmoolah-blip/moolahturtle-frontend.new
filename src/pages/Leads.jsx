import { useState } from "react";
import api from "@/lib/api";

export default function Leads() {
  const [result, setResult] = useState("Click to test /health on your backend");

  const testHealth = async () => {
    try {
      const { data, status } = await api.get("/health");
      setResult(`OK (status ${status}) → ${typeof data === "string" ? data : JSON.stringify(data)}`);
    } catch (e) {
      setResult(`ERROR → ${e.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>
      <button onClick={testHealth} className="border px-3 py-1 rounded">
        Test API /health
      </button>
      <pre className="mt-4 p-3 bg-gray-50 rounded text-sm">{result}</pre>
    </div>
  );
}
