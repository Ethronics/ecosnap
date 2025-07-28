import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Waves,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  Shield,
  Users,
  UserCheck,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, error, signupSuccess, resetSignupSuccess } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  // Reset signup success when component mounts
  useEffect(() => {
    resetSignupSuccess();
  }, [resetSignupSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const signupData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    const result = await signup(signupData);

    if (result.success) {
      toast({
        title: "Welcome to EcoSnap!",
        description:
          "Your account has been created successfully. Please log in.",
      });
      navigate("/login");
    } else {
      toast({
        title: "Signup failed",
        description:
          result.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 rounded-3xl"
        >
          <Link
            to="/"
            className="inline-flex items-center text-foreground/70 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div className="text-center mb-8">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <Waves className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EcoSnap
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Join EcoSnap</h1>
            <p className="text-foreground/70 mt-2">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="pl-10 glass-card border-white/20 text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="pl-10 glass-card border-white/20 text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className="pl-10 pr-10 glass-card border-white/20 text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  className="pl-10 pr-10 glass-card border-white/20 text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  required
                >
                  <option
                    value="employee"
                    className="bg-background text-foreground"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Employee</span>
                    </div>
                  </option>
                  <option
                    value="staff"
                    className="bg-background text-foreground"
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Staff</span>
                    </div>
                  </option>
                  <option
                    value="manager"
                    className="bg-background text-foreground"
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Manager</span>
                    </div>
                  </option>
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs text-foreground/60">
                {formData.role === "employee" && (
                  <>
                    <User className="h-4 w-4 text-green-400" />
                    <span>
                      Employee: Basic access to environmental dashboard and
                      alerts.
                    </span>
                  </>
                )}
                {formData.role === "staff" && (
                  <>
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>
                      Staff: Enhanced access with monitoring and insights.
                    </span>
                  </>
                )}
                {formData.role === "manager" && (
                  <>
                    <Shield className="h-4 w-4 text-amber-400" />
                    <span>
                      Manager: Full access with administrative privileges
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary/80 hover:bg-primary text-white backdrop-blur-sm py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-foreground/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-accent transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
