import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/authStore";
import {
  Waves,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Users,
  User,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Login form submitted with:", { email, password: "***" });

    const success = await login(email, password);
    console.log("Login result:", success);

    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // Get user from auth store and redirect based on role
      const user = useAuthStore.getState().user;
      console.log("User from store:", user);

      if (user && user.role) {
        console.log("Navigating to:", `/dashboard/${user.role}`);
        navigate(`/dashboard/${user.role}`);
      } else {
        console.log("Navigating to: /dashboard");
        navigate("/dashboard");
      }
    } else {
      const currentError = useAuthStore.getState().error;
      console.log("Login failed, error:", currentError);
      toast({
        title: "Login failed",
        description: currentError || "Invalid email or password.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-foreground/70 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              className="w-full bg-primary/80 hover:bg-primary text-white backdrop-blur-sm py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* <div className="mt-6 p-4 glass-card rounded-xl">
            <h3 className="text-sm font-medium text-foreground/80 mb-3">
              Demo Credentials:
            </h3>
            <div className="space-y-2 text-xs text-foreground/60">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <span>Manager: manager@EcoSnap.com / manager123</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Staff: staff@EcoSnap.com / staff123</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-green-400" />
                <span>Employee: employee@EcoSnap.com / employee123</span>
              </div>
            </div>
          </div> */}

          <div className="text-center mt-6">
            <p className="text-foreground/70">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-accent transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
