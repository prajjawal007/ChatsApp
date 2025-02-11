import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from "../lib/axios.js";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern.jsx';

// const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/auth/forgot-password`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                setStep(2);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            console.log("Sending OTP:", otp, "Email:", email); // Debugging line
            
            const response = await axiosInstance.post(`/auth/verify-forgot-password-otp`, { 
                email, 
                otp: Number(otp)  // Ensure OTP is sent as a number
            });
    
            if (response.data.success) {
                toast.success(response.data.message);
                setStep(3);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error response:", error.response);  // Debugging line
            toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleResetPassword = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/auth/reset-password`, {
                email,
                otp,
                newPassword,
            });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message || "Failed to reset password. Please try agai");
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen grid lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>
                  <p className="text-base-content/60">Reset your password in a few steps</p>
                </div>
              </div>
    
              {/* Step 1: Send OTP */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                      <input
                        type="email"
                        className="input input-bordered w-full pl-10"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
                  </button>
                </form>
              )}
    
              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">OTP</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify OTP"}
                  </button>
                </form>
              )}
    
              {/* Step 3: Reset Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">New Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input input-bordered w-full pl-10"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
    
          {/* Right Side - Image/Pattern */}
          <AuthImagePattern
            title={"Secure your account"}
            subtitle={"Reset your password and get back to your account safely."}
          />
        </div>
      );
    };
export default ForgotPassword;

