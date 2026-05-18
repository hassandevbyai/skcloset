export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Delivery</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Shipping &amp; Delivery</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl space-y-8">
          {[
            { title: "Processing Time", content: "Orders are processed within 1-2 business days. You will receive a confirmation email once your order has been shipped along with tracking information." },
            { title: "Domestic Shipping", content: "Standard shipping (5-7 business days) — $5.99 or free on orders over $150. Express shipping (2-3 business days) — $14.99." },
            { title: "International Shipping", content: "We ship worldwide. Standard international (10-14 business days) — $15.99. Express international (5-7 business days) — $29.99. Duties and taxes may apply." },
            { title: "Order Tracking", content: "Once your order ships, you will receive a tracking number via email. You can also track your order through your account dashboard." },
            { title: "Shipping Restrictions", content: "We currently do not ship to P.O. boxes or APO/FPO addresses. Some oversized items may have additional shipping charges." },
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
