export function HeroBanner() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl bg-ink px-6 py-14 text-center sm:mt-10 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(210,255,124,0.18),transparent_35%),radial-gradient(circle_at_85%_75%,rgba(167,242,41,0.14),transparent_40%)]"
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-lime-200 sm:text-[32px]">
          The Gateway to Unforgettable Events
        </h1>
        <p className="text-sm leading-relaxed text-white/90 sm:text-[15px]">
          Book tickets for concerts, meet-and-greets, and exclusive events.
          Get closer to the action!
        </p>
        <div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-6 bg-primary" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
