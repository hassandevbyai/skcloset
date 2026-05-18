export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Get in Touch</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Contact Us</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-2xl space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Have a question, comment, or concern? We&apos;d love to hear from you. Reach out to our team and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-2">Email</h3>
              <a href="mailto:support@skcloset.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">support@skcloset.com</a>
            </div>
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-2">Phone</h3>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-2">Address</h3>
              <p className="text-sm text-muted-foreground">123 Fashion Avenue, Suite 200<br />New York, NY 10001<br />United States</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
