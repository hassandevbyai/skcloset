export default function SizeGuidePage() {
  const sizes = [
    { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36", inseam: "30" },
    { size: "S", chest: "36-38", waist: "30-32", hip: "36-38", inseam: "31" },
    { size: "M", chest: "38-40", waist: "32-34", hip: "38-40", inseam: "32" },
    { size: "L", chest: "40-42", waist: "34-36", hip: "40-42", inseam: "33" },
    { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44", inseam: "34" },
    { size: "XXL", chest: "44-46", waist: "38-40", hip: "44-46", inseam: "34" },
  ]
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Measurements</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Size Guide</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Find your perfect fit with our size guide. Measurements are in inches. If you&apos;re between sizes, we recommend sizing up for a relaxed fit.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-xs tracking-[0.15em] uppercase text-foreground font-medium">Size</th>
                  <th className="py-3 pr-4 text-xs tracking-[0.15em] uppercase text-foreground font-medium">Chest</th>
                  <th className="py-3 pr-4 text-xs tracking-[0.15em] uppercase text-foreground font-medium">Waist</th>
                  <th className="py-3 pr-4 text-xs tracking-[0.15em] uppercase text-foreground font-medium">Hip</th>
                  <th className="py-3 text-xs tracking-[0.15em] uppercase text-foreground font-medium">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((row) => (
                  <tr key={row.size} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-medium text-foreground">{row.size}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{row.chest}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{row.waist}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{row.hip}</td>
                    <td className="py-3 text-sm text-muted-foreground">{row.inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">How to Measure</h2>
            <div className="space-y-3">
              {[
                { label: "Chest", desc: "Measure around the fullest part of your chest, keeping the tape measure horizontal." },
                { label: "Waist", desc: "Measure around your natural waistline, just above your belly button." },
                { label: "Hip", desc: "Measure around the fullest part of your hips, keeping the tape measure level." },
                { label: "Inseam", desc: "Measure from the top of your inner thigh to the bottom of your ankle." },
              ].map((m) => (
                <div key={m.label}>
                  <h3 className="text-sm font-medium text-foreground">{m.label}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
