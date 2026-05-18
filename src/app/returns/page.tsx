export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Policy</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Returns &amp; Exchanges</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl space-y-8">
          {[
            { title: "Return Policy", content: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and with all tags attached. Final sale items are not eligible for return." },
            { title: "How to Return", content: "Initiate a return through your account or contact our support team. You will receive a prepaid return label. Drop your package at any designated shipping location." },
            { title: "Refunds", content: "Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method. Shipping costs are non-refundable." },
            { title: "Exchanges", content: "We offer size exchanges within 30 days. Contact support to check availability. If the requested size is unavailable, a full refund will be issued." },
            { title: "Damaged or Incorrect Items", content: "If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with your order number and photos. We will resolve the issue at no additional cost." },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="text-lg font-medium text-foreground mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
