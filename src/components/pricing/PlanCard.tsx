import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface PlanCardProps {
  title: string
  price: string
  description: string
  features: string[]
  savings?: string
  buttonText: string
  buttonVariant?: "default" | "outline" | "secondary"
  note?: string
  onSelect: () => void
}

export function PlanCard({
  title,
  price,
  description,
  features,
  savings,
  buttonText,
  buttonVariant = "default",
  note,
  onSelect
}: PlanCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="min-h-[60px]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
        </div>
        {savings && (
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            {savings}
          </p>
        )}
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col mt-auto">
        <Button
          variant={buttonVariant}
          className="w-full"
          onClick={onSelect}
        >
          {buttonText}
        </Button>
        {note && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {note}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}