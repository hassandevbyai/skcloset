"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface SizeGuideModalProps {
  category: string
  isOpen: boolean
  onClose: () => void
}

function getSizes(category: string): { label: string; chest: string; waist: string; hip: string }[] {
  const c = category.toLowerCase()
  if (c === "bottoms") {
    return [
      { label: "28", chest: "—", waist: "28", hip: "34" },
      { label: "30", chest: "—", waist: "30", hip: "36" },
      { label: "32", chest: "—", waist: "32", hip: "38" },
      { label: "34", chest: "—", waist: "34", hip: "40" },
      { label: "36", chest: "—", waist: "36", hip: "42" },
      { label: "38", chest: "—", waist: "38", hip: "44" },
    ]
  }
  if (c === "footwear") {
    return [
      { label: "7", chest: "—", waist: "—", hip: "—" },
      { label: "8", chest: "—", waist: "—", hip: "—" },
      { label: "9", chest: "—", waist: "—", hip: "—" },
      { label: "10", chest: "—", waist: "—", hip: "—" },
      { label: "11", chest: "—", waist: "—", hip: "—" },
      { label: "12", chest: "—", waist: "—", hip: "—" },
      { label: "13", chest: "—", waist: "—", hip: "—" },
    ]
  }
  return [
    { label: "XS", chest: "34", waist: "28", hip: "34" },
    { label: "S", chest: "36", waist: "30", hip: "36" },
    { label: "M", chest: "38", waist: "32", hip: "38" },
    { label: "L", chest: "40", waist: "34", hip: "40" },
    { label: "XL", chest: "42", waist: "36", hip: "42" },
    { label: "XXL", chest: "44", waist: "38", hip: "44" },
  ]
}

export default function SizeGuideModal({ category, isOpen, onClose }: SizeGuideModalProps) {
  const sizes = getSizes(category)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-sm tracking-[0.15em] uppercase">Size Guide</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-4">
            Measurements in inches
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.1em]">Size</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.1em]">Chest</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.1em]">Waist</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.1em]">Hip</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((row) => (
                  <tr key={row.label} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-foreground font-medium">{row.label}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.chest}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{row.waist}</td>
                    <td className="py-3 text-muted-foreground">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            Measurements are body measurements, not garment measurements. If you are between sizes, we recommend sizing up for a more relaxed fit.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}