import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { incidentSchema } from "./validation/schema";
import { CardTitle } from "@/components/ui/card";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Incidents",
  description: "A incident tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getIncidents() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/incidents/data/incidents.json")
  );

  const incidents = JSON.parse(data.toString());

  return z.array(incidentSchema).parse(incidents);
}

export default async function IncidentPage() {
  const incidents = await getIncidents();

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Incidents</CardTitle>
            <CardDescription>
              Filter and manage your assigned incidents
            </CardDescription>
          </div>
        </div>
        <DataTable data={incidents} columns={columns} />
      </div>
    </div>
  );
}
