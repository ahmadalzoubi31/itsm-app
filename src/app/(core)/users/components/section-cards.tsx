import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SectionCards = ({
  totalUsers,
  totalNewUsers,
  totalManualUsers,
  totalImportedUsers,
  totalAgentUsers,
}: {
  totalUsers: number;
  totalNewUsers: number;
  totalManualUsers: number;
  totalImportedUsers: number;
  totalAgentUsers: number;
}) => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-8">
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>New Users (30 days)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalNewUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Agent Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAgentUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Manual Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalManualUsers}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card py-3 ">
        <CardHeader>
          <CardDescription>Imported Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalImportedUsers}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SectionCards;
