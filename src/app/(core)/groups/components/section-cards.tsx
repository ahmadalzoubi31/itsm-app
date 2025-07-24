import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SectionCards = ({
  totalGroups,
  totalActiveGroups,
  totalSupportGroups,
  totalTechnicalGroups,
  totalPendingGroups,
}: {
  totalGroups: number;
  totalActiveGroups: number;
  totalSupportGroups: number;
  totalTechnicalGroups: number;
  totalPendingGroups: number;
}) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-8">
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Total Groups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalGroups}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Active Groups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalActiveGroups}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Support Groups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSupportGroups}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Technical Groups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTechnicalGroups}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Pending Groups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPendingGroups}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SectionCards;
