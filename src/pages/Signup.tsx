import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('mockUserName', name || 'Traveler');
      toast.success("Account created (mock)");
      navigate("/");
    }, 800);
  };

  return (
    <section className="min-h-screen flex items-center justify-center container-padding">
      <div className="w-full max-w-md card-premium p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>navigate('/signup')} className="flex-1 btn-primary">Create Account</button>
          <button onClick={()=>navigate('/login')} className="flex-1 btn-outline-hero">Log In</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} minLength={6} required />
          </div>
          <button type="submit" className="w-full btn-primary transition-transform active:scale-95 hover:scale-[1.02]" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
            <ArrowRight className="inline ml-2 h-4 w-4" />
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">Already have an account? <button onClick={()=>navigate('/login')} className="text-primary hover:underline">Log in</button></p>
      </div>
    </section>
  );
};

export default Signup;
