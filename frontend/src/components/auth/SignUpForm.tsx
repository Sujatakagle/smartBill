import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { AuthContext } from "../../context/AuthContext";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) return null;

  const { register } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white/95 p-7 shadow-xl shadow-gray-200/60 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-black/20 sm:p-8">
      {error && (
        <div className="p-4 mb-6 text-base text-red-500 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-7">
          <div>
            <Label className="text-base">
              Full Name<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="h-12 text-base"
            />
          </div>
          <div>
            <Label className="text-base">
              Email<span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
          <div>
            <Label className="text-base">
              Password<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="h-12 text-base"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              className="w-5 h-5"
              checked={isChecked}
              onChange={setIsChecked}
            />
            <p className="inline-block text-base font-normal leading-6 text-gray-500 dark:text-gray-400">
              By creating an account means you agree to the{" "}
              <span className="text-gray-800 dark:text-white/90">
                Terms and Conditions,
              </span>{" "}
              and our{" "}
              <span className="text-gray-800 dark:text-white">
                Privacy Policy
              </span>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full rounded-lg bg-brand-500 px-4 py-4 text-base font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:bg-brand-300"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-base font-normal text-gray-600 dark:text-gray-400">
        Already have an account?
        <Link
          to="/signin"
          className="text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-1"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
