import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { incidentSchema } from "./validation/schema";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

// Simulate a database read for tasks.
async function getIncidents() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/(core)/incidents/data/incidents.json")
  );
  const incidents = JSON.parse(data.toString());

  return z.array(incidentSchema).parse(incidents);
}

export default async function IncidentPage() {
  const incidents = await getIncidents();

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Incidents
          <div className="text-muted-foreground text-sm font-normal">
            Filter and manage your assigned users
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <DataTable data={incidents} columns={columns} />
      </div>
    </>
  );
}
