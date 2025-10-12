import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore"
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const { login, isLoggingIn,handleGoogleLogin} = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

 const validateForm = () => {
  if (!formData.email?.trim()) return toast.error("Email is required");
  if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
  if (!formData.password) return toast.error("Password is required");
  if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
  return true;
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

     const success = validateForm();
    if (success === true) login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-50 text-gray-800 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-sky-100">
        
        {/* Logo + App Name */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Digital Wealth Logo"
            className="w- h-16 mb-2 "
          />
        
          <p className="text-sm text-gray-500 mt-1">
            Invest smart. Grow with confidence.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full bg-sky-50 text-gray-800 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-sky-50 text-gray-800 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-sky-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:from-sky-400 hover:to-blue-500 transition-all shadow-md"
          >
           {isLoggingIn ? (
  <div className="flex items-center justify-center gap-2">
    <Loader2 className="size-7 animate-spin" />
    <span>Loading...</span>
  </div>
) : (
  "Login"
)}

          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-3">
            <div className="h-px bg-gray-300 w-1/4"></div>
            <span className="text-gray-500 text-sm mx-2">or</span>
            <div className="h-px bg-gray-300 w-1/4"></div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-sky-50 transition-all shadow-sm"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-5">
          Create Account?{" "}
          <Link to="/signup" className="text-sky-600 font-medium hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}


