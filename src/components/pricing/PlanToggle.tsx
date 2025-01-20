import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface PlanToggleProps {
  isYearly: boolean
  onToggle: (checked: boolean) => void
}

export function PlanToggle({ isYearly, onToggle }: PlanToggleProps) {
  return (
    <div className="flex items-center space-x-4 justify-center mb-8">
      <Label htmlFor="billing-toggle" className={!isYearly ? "text-primary" : "text-muted-foreground"}>Monthly</Label>
      <Switch
        id="billing-toggle"
        checked={isYearly}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="billing-toggle" className={isYearly ? "text-primary" : "text-muted-foreground"}>Yearly</Label>
    </div>
  )
}