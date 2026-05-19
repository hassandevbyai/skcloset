"use client"
import { PDFDownloadLink } from "@react-pdf/renderer"
import InvoicePDF from "./InvoicePDF"
import { FileDown } from "lucide-react"

export default function InvoiceDownloadButton({ order, storeName = "SKCLOSET" }: { order: { id: string; items: unknown[]; createdAt: string; status?: string; paymentMethod?: string; subtotal?: number; shipping?: number; discount?: number; total?: number; shippingAddress?: Record<string, unknown>; email?: string }; storeName?: string }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF order={order} storeName={storeName} />}
      fileName={`invoice-${order.id?.slice(0, 8).toUpperCase() || "order"}.pdf`}
      className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase bg-accent text-white px-4 py-2.5 rounded-sm hover:bg-accent/90 transition-colors"
    >
      {({ loading }) => (
        <>
          <FileDown className="w-3.5 h-3.5" />
          {loading ? "Generating..." : "Download Invoice"}
        </>
      )}
    </PDFDownloadLink>
  )
}
