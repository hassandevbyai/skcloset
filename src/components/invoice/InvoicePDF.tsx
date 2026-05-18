"use client"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#d4a574",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
    marginBottom: 2,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 3,
  },
  totalLabel: { width: 100, textAlign: "right", marginRight: 20 },
  totalValue: { width: 80, textAlign: "right" },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 5,
    fontSize: 12,
    fontWeight: 700,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999",
    fontSize: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
})

export default function InvoicePDF({ order, storeName = "SKCLOSET" }: { order: any; storeName?: string }) {
  const subtotal = order.subtotal || order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0
  const shipping = order.shipping ?? 10
  const discount = order.discount || 0
  const total = order.total || subtotal + shipping - discount
  const addr = order.shippingAddress || {}
  const fullName = addr.firstName && addr.lastName ? `${addr.firstName} ${addr.lastName}` : addr.fullName || "Customer"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>{storeName}</Text>
            <Text style={{ fontSize: 8, color: "#666", marginTop: 4 }}>Premium Men's Fashion</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={{ fontSize: 8, color: "#666", marginTop: 4 }}>#{order.id?.slice(0, 8).toUpperCase()}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          <View style={styles.section}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.value}>{fullName}</Text>
            <Text style={styles.value}>{addr.email || order.email || ""}</Text>
            <Text style={styles.value}>{addr.phone || ""}</Text>
            <Text style={styles.value}>{addr.address || ""}</Text>
            <Text style={styles.value}>
              {addr.city || ""}{addr.state ? ", " : ""}{addr.state || ""} {addr.zip || ""}
            </Text>
          </View>
          <View style={[styles.section, { alignItems: "flex-end" }]}>
            <Text style={styles.label}>Order Info</Text>
            <Text style={styles.value}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.value}>Status: {(order.status || "").toUpperCase()}</Text>
            <Text style={styles.value}>Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card"}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, { fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }]}>Item</Text>
            <Text style={[styles.col2, { fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }]}>Qty</Text>
            <Text style={[styles.col3, { fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }]}>Price</Text>
            <Text style={[styles.col4, { fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }]}>Total</Text>
          </View>

          {(order.items || []).map((item: any, i: number) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.col1}>
                {item.name}
                {item.color || item.size ? ` (${item.color || ""}${item.color && item.size ? " / " : ""}${item.size || ""})` : ""}
              </Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>${(item.price || 0).toFixed(2)}</Text>
              <Text style={styles.col4}>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>${shipping.toFixed(2)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for shopping with {storeName} | For questions, contact support@skcloset.com
        </Text>
      </Page>
    </Document>
  )
}
