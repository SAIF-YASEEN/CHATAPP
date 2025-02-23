import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to send OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Email is required!");
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://chatapp-backend-production-af65.up.railway.app/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("OTP sent!");
        setStep(2);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("OTP is required!");
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://chatapp-backend-production-af65.up.railway.app/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }), // Ensure email is sent!
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("OTP verified!");
        setStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("All fields are required!");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://chatapp-backend-production-af65.up.railway.app/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 bg-gray-100">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        {step === 1 && (
          <>
            <input
              type="email"
              className="input input-bordered w-full pl-10"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Ensure this updates correctly
            />

            <SubmitButton
              onClick={handleSendOtp}
              isLoading={isLoading}
              text="Send OTP"
            />
          </>
        )}
        {step === 2 && (
          <>
            <InputField
              label="Enter OTP"
              value={otp}
              onChange={setOtp}
              type="text"
              placeholder="Enter OTP"
            />
            <SubmitButton
              onClick={handleVerifyOtp}
              isLoading={isLoading}
              text="Verify OTP"
            />
          </>
        )}
        {step === 3 && (
          <>
            <InputField
              icon={Lock}
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              type="password"
              placeholder="Enter new password"
            />
            <InputField
              icon={Lock}
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              placeholder="Confirm password"
            />
            <SubmitButton
              onClick={handleChangePassword}
              isLoading={isLoading}
              text="Change Password"
            />
          </>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  icon: Icon,
  label,
  value,
  onChange,
  type,
  placeholder,
}) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />}
      <input
        type={type}
        className="input input-bordered w-full pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const SubmitButton = ({ onClick, isLoading, text }) => (
  <button
    onClick={onClick}
    className="btn btn-primary w-full"
    disabled={isLoading}
  >
    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : text}
  </button>
);

export default ForgotPassword;
