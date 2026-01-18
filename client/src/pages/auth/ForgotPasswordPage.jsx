import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Loader } from "lucide-react";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is invalid");
      return;
    }

    setError("");

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      setError(error || "Failed to send reset link. please try again");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l9 6 9-6M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Check Your Email
            </h2>

            <p className="text-slate-600">
              We’ve sent a password reset link to your email address.
            </p>

            <p className="text-slate-600 text-sm">
              If an account with <strong>{email}</strong> exists, you will
              receive a password reset email shortly.
            </p>

            <div className="space-y-4">
              <Link
                to="/login"
                className="block text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Back to Login
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full btn-primary"
              >
                Send another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Forgot Password</h1>
          <p className="text-slate-600 mt-2">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`input ${error ? "input-error" : ""}`}
                placeholder="Enter your email"
                disabled={isRequestingForToken}
              />
            </div>

            <button
              type="submit"
              disabled={isRequestingForToken}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequestingForToken ? (
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
