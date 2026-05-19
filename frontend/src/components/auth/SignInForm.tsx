import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { AuthContext } from "../../context/AuthContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) return null;

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
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
              Email <span className="text-error-500">*</span>{" "}
            </Label>
            <Input
              placeholder="info@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
          <div>
            <Label className="text-base">
              Password <span className="text-error-500">*</span>{" "}
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block text-base font-normal text-gray-700 dark:text-gray-400">
                Keep me logged in
              </span>
            </div>
            <Link
              to="#!"
              className="text-base text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>
          <Button className="w-full rounded-lg py-4 text-base font-semibold" size="sm" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <p className="mt-7 text-center text-base font-normal text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
        >
          Sign Up
        </Link>
      </p>
      </div>
  );
}
