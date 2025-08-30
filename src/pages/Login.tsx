import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('mockUserEmail', email);
      toast.success("Logged in (mock)");
      navigate("/");
    }, 700);
  };

  return (
    <section className="min-h-screen flex items-center justify-center container-padding">
      <div className="w-full max-w-md card-premium p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>navigate('/login')} className="flex-1 btn-primary">Log In</button>
          <button onClick={()=>navigate('/signup')} className="flex-1 btn-outline-hero">Create Account</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <motion.button type="submit" className="w-full btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="inline ml-2 h-4 w-4" />
          </motion.button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">New here? <button onClick={()=>navigate('/signup')} className="text-primary hover:underline inline-flex items-center gap-1"><UserPlus className="h-3 w-3"/>Create account</button></p>
      </div>
    </section>
  );
};

export default Login;
