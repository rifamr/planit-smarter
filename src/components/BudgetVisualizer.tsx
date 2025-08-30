import { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const initial = [
  { name: "Flights ✈️", value: 40, tip: "Book 6-8 weeks early." },
  { name: "Stay 🏨", value: 30, tip: "Try eco stays and hostels." },
  { name: "Food 🍲", value: 15, tip: "Eat local street food." },
  { name: "Activities 🎡", value: 15, tip: "Bundle passes for discounts." },
];

const colors = ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa"];

const BudgetVisualizer = () => {
  const [data, setData] = useState(initial);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  const randomize = () => {
    setData((d) => d.map((x) => ({ ...x, value: Math.max(5, Math.min(70, Math.round(x.value + (Math.random() * 20 - 10)))) })));
  };

  return (
    <section id="budget-visualizer" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Smart Budget Visualizer</h2>
          <button onClick={randomize} className="btn-primary">Update Mock Numbers</button>
        </div>

        <div className="h-80 card-premium p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
              <YAxis tick={{ fill: "#64748b" }} domain={[0, 80]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p: any = payload[0].payload;
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow">
                    <p className="font-medium">{p.name}: {p.value}%</p>
                    <p className="text-sm text-muted-foreground">Tip: {p.tip}</p>
                  </div>
                );
              }} />
              <Bar dataKey="value" animationDuration={800}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Total allocation: {total}%</p>
      </div>
    </section>
  );
};

export default BudgetVisualizer;
