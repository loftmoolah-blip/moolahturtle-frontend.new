import { useAuth } from "@/auth/AuthProvider.jsx";

export default function Login() {
  const { login } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Login</h1>
      <p>This is a placeholder. Click to simulate login:</p>
      <button onClick={login} className="border px-3 py-1 rounded text-green-600 mt-3">Login</button>
    </div>
  );
}
