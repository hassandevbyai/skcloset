export interface InventoryLog {
  id: string
  productId: string
  variantLabel: string      // e.g. "Black / M"
  color: string
  size: string
  change: number              // positive = added, negative = removed
  previousStock: number
  newStock: number
  reason: string
  timestamp: string
}

const LOG_KEY = "skcloset_inventory_logs"

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function readLogs(): InventoryLog[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLogs(logs: InventoryLog[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOG_KEY, JSON.stringify(logs))
  }
}

export function addInventoryLog(
  productId: string,
  variantLabel: string,
  color: string,
  size: string,
  change: number,
  previousStock: number,
  reason: string
): InventoryLog {
  const log: InventoryLog = {
    id: genId(),
    productId,
    variantLabel,
    color,
    size,
    change,
    previousStock,
    newStock: previousStock + change,
    reason,
    timestamp: new Date().toISOString(),
  }
  const logs = readLogs()
  logs.unshift(log) // newest first
  writeLogs(logs)
  return log
}

export function getInventoryLogs(productId?: string): InventoryLog[] {
  const logs = readLogs()
  if (productId) {
    return logs.filter((l) => l.productId === productId)
  }
  return logs
}

export function clearInventoryLogs(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOG_KEY)
  }
}