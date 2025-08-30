const StarrySky = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block">
      {stars.map((s) => (
        <span key={s.id} style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} className="absolute rounded-full bg-white/80 shadow-[0_0_8px_#fff] animate-pulse-slow" />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
    </div>
  );
};

export default StarrySky;
