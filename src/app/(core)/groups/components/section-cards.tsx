import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Wrench, Clock, Activity } from "lucide-react";

interface SectionCardsProps {
  totalGroups: number;
  totalActiveGroups: number;
  totalSupportGroups: number;
  totalTechnicalGroups: number;
  totalPendingGroups: number;
}

export default function SectionCards({
  totalGroups,
  totalActiveGroups,
  totalSupportGroups,
  totalTechnicalGroups,
  totalPendingGroups,
}: SectionCardsProps) {
  const cards = [
    {
      title: "Total Groups",
      value: totalGroups,
      icon: Users,
      description: "All support groups",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Groups",
      value: totalActiveGroups,
      icon: Activity,
      description: "Currently active groups",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Support Groups",
      value: totalSupportGroups,
      icon: Shield,
      description: "General support teams",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Technical Groups",
      value: totalTechnicalGroups,
      icon: Wrench,
      description: "Technical specialist teams",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Pending Groups",
      value: totalPendingGroups,
      icon: Clock,
      description: "Awaiting activation",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 