import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

export const StatsCard = ({ icon: Icon, value, label, className }: StatsCardProps) => {
  return (
    <Card className="p-6 text-center bg-gradient-card border-border/50 hover:border-primary/30 transition-all hover:shadow-elevated group">
      <div className="mb-4 flex justify-center">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className={cn("h-6 w-6", className)} />
        </div>
      </div>
      <div className="text-3xl font-bold mb-1 group-hover:text-primary transition-colors">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </Card>
  );
};