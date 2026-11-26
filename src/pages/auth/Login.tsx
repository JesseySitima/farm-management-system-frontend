import { useState } from "react";
import { Eye, EyeOff, Sprout } from "lucide-react";
import { login } from "../../services/auth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      if (response.success) {
        sessionStorage.setItem("access_token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        window.location.href = "/dashboard";
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left section */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-green-900
        flex-col justify-between p-12 text-white"
      >
        <div className="flex items-center gap-3">
          <Sprout size={32} />
          <span className="text-2xl font-bold">Farm Management</span>
        </div>

        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Growing smarter.
            <br />
            Managing better.
          </h1>

          <p className="mt-6 text-green-100 text-lg leading-relaxed">
            Manage your farm operations, monitor activities and make better
            decisions from one place.
          </p>
        </div>

        <p className="text-sm text-green-200">Farm Management System</p>
      </div>

      {/* Right section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div
            className="lg:hidden flex items-center gap-2 mb-10
            text-green-800"
          >
            <Sprout size={28} />
            <span className="text-xl font-bold">Farm Management</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>

            <p className="mt-2 text-gray-500">
              Sign in to access your farm management system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium
                text-gray-700 mb-2"
              >
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg border border-gray-300
                  px-4 py-3 outline-none transition
                  focus:border-green-700 focus:ring-2
                  focus:ring-green-100"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium
                text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300
                    px-4 py-3 pr-12 outline-none transition
                    focus:border-green-700 focus:ring-2
                    focus:ring-green-100"
                />
                {error && (
                  <div
                    className="rounded-lg bg-red-50 border border-red-200
                                px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2
                    -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-800 py-3
                font-semibold text-white transition
                hover:bg-green-900 disabled:opacity-60
                disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Farm Management System. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
