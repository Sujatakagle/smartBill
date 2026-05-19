import { FormEvent, useContext, useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { AuthContext } from "../context/AuthContext";
import { EyeCloseIcon, EyeIcon } from "../icons";
import { Mail, UserRound } from "lucide-react";
import Swal from "sweetalert2";

export default function UserProfiles() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const updateProfile = authContext?.updateProfile;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const nameParts = (user.name || "").trim().split(/\s+/).filter(Boolean);
    setFirstName(user.firstName || nameParts[0] || "");
    setLastName(user.lastName || nameParts.slice(1).join(" ") || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!updateProfile) return;

    setError("");
    setLoading(true);

    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        ...(password ? { password } : {}),
      });
      setPassword("");
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your account details have been saved successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#465fff",
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || "Failed to update profile.";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMsg,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}` || "U";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";

  return (
    <>
      <PageMeta
        title="Profile | Expenzoir"
        description="Manage your Expenzoir profile"
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold uppercase text-brand-600 ring-1 ring-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/20">
              {initials}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {fullName}
              </h3>
              <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center">
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-4" />
                  {email || "No email"}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <UserRound className="size-4" />
                  Expenzoir user
                </span>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Account Information
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update your name, email, or password.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter last name"
              />
            </div>

            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 fill-current" />
                  ) : (
                    <EyeCloseIcon className="size-5 fill-current" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button size="sm" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
