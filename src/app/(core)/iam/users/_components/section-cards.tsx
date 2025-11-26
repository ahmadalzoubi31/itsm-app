import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  totalUsers: number;
  totalNewUsers: number;
  totalManualUsers: number;
  totalImportedUsers: number;
  totalAgentUsers: number;
}

const SectionCards = ({
  totalUsers,
  totalNewUsers,
  totalManualUsers,
  totalImportedUsers,
  totalAgentUsers,
}: SectionCardsProps) => {
  const cards = [
    { label: "Total Users", value: totalUsers },
    { label: "New Users (30 days)", value: totalNewUsers },
    { label: "Agent Users", value: totalAgentUsers },
    { label: "Manual Users", value: totalManualUsers },
    { label: "Imported Users", value: totalImportedUsers },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-8">
      {cards.map((item) => (
        <Card key={item.label} className="@container/card py-3">
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default SectionCards;
