import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layouts/AuthLayout";
import { Loader2, User, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks/reduxHooks";
import { registerUser } from "../../app/features/authSlice";

export const Signup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        agree: false
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, password } = formData;
        dispatch(registerUser({ name, email, password }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join thousands of builders today."
        >
            {error && (
                <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-foreground mb-2">
                        Full Name
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <User className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:bg-card hover:border-muted-foreground/30"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-foreground mb-2">
                        Email address
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <Mail className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:bg-card hover:border-muted-foreground/30"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-bold text-foreground mb-2">
                        Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <Lock className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:bg-card hover:border-muted-foreground/30"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="agree"
                            name="agree"
                            type="checkbox"
                            required
                            checked={formData.agree}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-border rounded transition-all cursor-pointer"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="agree" className="text-muted-foreground">
                            I agree to the{" "}
                            <a href="#" className="font-bold text-primary hover:text-primary/95 hover:underline transition-colors">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="font-bold text-primary hover:text-primary/95 hover:underline transition-colors">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading || !formData.agree}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all enabled:hover:scale-[1.02] enabled:active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Create Account
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center shadow-sm">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground font-medium">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => window.location.href = "https://ai-task-orchestrator-u46k.onrender.com/api/auth/google"} 
                        className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-xl shadow-sm bg-card text-sm font-bold text-foreground hover:bg-secondary/50 transition-all"
                    >
                        Google
                    </button>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-primary hover:text-primary/95 hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
