export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="blob absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-accent/30 blur-[120px]" />
      <div
        className="blob absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent-2/20 blur-[120px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="blob absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/10 blur-[120px]"
        style={{ animationDelay: "-14s" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
