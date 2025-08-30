import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { CreditCard, Shield, ArrowLeftCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const plan = location?.state?.plan || 'pro';
  const price = location?.state?.price ?? 19;
  const [processing, setProcessing] = useState(false);

  const planName = useMemo(() => ({ free:'Explorer', pro:'Adventurer', premium:'Globetrotter' }[plan] || 'Adventurer'), [plan]);

  const pay = async () => {
    setProcessing(true);
    setTimeout(() => {
      toast.success('Payment successful (mock)');
      navigate('/');
    }, 1200);
  };

  return (
    <section className="min-h-screen container-padding py-16">
      <div className="max-w-3xl mx-auto card-premium p-6">
        <button onClick={()=>navigate(-1)} className="btn-ghost mb-4 inline-flex items-center gap-2"><ArrowLeftCircle className="h-4 w-4"/>Back</button>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-primary"/>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Cardholder Name</label>
            <input className="w-full px-3 py-2 rounded-lg border border-border bg-background mt-1" placeholder="Full name" />
            <label className="text-sm font-medium mt-3 block">Card Number</label>
            <input className="w-full px-3 py-2 rounded-lg border border-border bg-background mt-1" placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-sm font-medium">Expiry</label>
                <input className="w-full px-3 py-2 rounded-lg border border-border bg-background mt-1" placeholder="MM/YY" />
              </div>
              <div>
                <label className="text-sm font-medium">CVC</label>
                <input className="w-full px-3 py-2 rounded-lg border border-border bg-background mt-1" placeholder="123" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-2"><Shield className="h-4 w-4"/> Secure mock payment</div>
          </div>
          <div className="bg-muted/30 rounded-xl p-4 h-fit">
            <h2 className="font-semibold mb-2">Order Summary</h2>
            <div className="flex justify-between text-sm mb-1"><span>Plan</span><span>{planName}</span></div>
            <div className="flex justify-between text-sm mb-1"><span>Billing</span><span>Monthly</span></div>
            <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>${price}</span></div>
            <div className="flex justify-between text-sm mb-3"><span>Tax</span><span>$0</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${price}</span></div>
            <button onClick={pay} className="w-full btn-primary mt-4" disabled={processing}>
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
            <div className="mt-3 text-xs text-green-600 inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> 30-day money-back guarantee</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
