import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server } from "lucide-react";
import { Clock, Users } from "lucide-react";
import BasicInfoPage from "./components/tab1/basic-info";
import { SyncSchedule } from "./components/tab2/SyncSchedule";
import { UserStaging } from "./components/tab3/UserStaging";

export default function LdapPage() {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          LDAP User Sync Manage
          <div className="text-muted-foreground text-sm font-normal">
            Manage Active Directory integration and user synchronization
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-8">
        <Tabs defaultValue="ldap" className="w-full space-y-6 gap-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ldap" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Basic info
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Sync Schedule
            </TabsTrigger>
            <TabsTrigger value="staging" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Staging
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ldap">
            <BasicInfoPage />
          </TabsContent>

          <TabsContent value="schedule">
            <SyncSchedule />
          </TabsContent>

          <TabsContent value="staging">
            <UserStaging />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
