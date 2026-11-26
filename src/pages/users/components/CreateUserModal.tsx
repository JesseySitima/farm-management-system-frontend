import { useState } from "react";
import { toast } from "sonner";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRoles } from "../../../hooks/useRoles";
import { registerUser } from "../../../services/auth";

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.role_id) {
      setError("Please select a user role.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await registerUser({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role_id: formData.role_id,
        ...(formData.phone.trim() && {
          phone: formData.phone.trim(),
        }),
      });

      toast.success("User created successfully.");
      onSuccess();
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        error.response?.data?.message ||
          "Failed to create user. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create New User
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a new user account and assign a role.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+265..."
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Initial Password *
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className={`${inputClass} pr-11`}
                placeholder="Enter initial password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-gray-500">
              The user should change this password on their first login.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              User Role *
            </label>

            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              disabled={rolesLoading}
              className={inputClass}
            >
              <option value="">
                {rolesLoading ? "Loading roles..." : "Select a role"}
              </option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {rolesError && (
              <p className="mt-1.5 text-sm text-red-600">{rolesError}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || rolesLoading || !!rolesError}
              className="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={17} className="animate-spin" />}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;
