export default function FAQPage() {
  const faqs = [
    { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay." },
    { q: "How long does shipping take?", a: "Domestic orders typically arrive within 5-7 business days. International orders may take 10-14 business days. Express shipping options are available at checkout." },
    { q: "Can I change or cancel my order?", a: "You can modify or cancel your order within 1 hour of placing it. After that, the order enters processing and cannot be changed." },
    { q: "Do you offer free shipping?", a: "Yes, we offer free standard shipping on domestic orders over $150." },
    { q: "What is your return policy?", a: "We accept returns within 30 days of delivery. Items must be unworn with tags attached. Final sale items are non-refundable." },
    { q: "How do I track my order?", a: "Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard." },
    { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination." },
    { q: "Are items true to size?", a: "Most items fit true to size. We recommend checking our size guide for specific measurements. If between sizes, consider sizing up." },
    { q: "How do I care for my purchases?", a: "Care instructions are included on each product&apos;s tag. Generally, we recommend cold washing and air drying to preserve fabric quality." },
    { q: "Do you offer gift wrapping?", a: "Yes, gift wrapping is available at checkout for an additional fee. You can include a personalized message with each gift order." },
  ]
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Help Center</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Frequently Asked Questions</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-border rounded-sm transition-colors open:border-accent/30">
              <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/20 transition-colors list-none">
                {faq.q}
                <svg className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
