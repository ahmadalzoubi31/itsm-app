import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, Users } from "lucide-react";
import { IncidentStatus, Priority } from "@/types/globals";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  getIncidentStatusLabel,
  getPriorityColor,
} from "@/utils/incident-utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconAlertCircleFilled,
  IconLoader,
} from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { IncidentWithDetails } from "@/types/globals";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export const schema = z.object({
//   id: z.string(),
//   number: z.string(),
//   title: z.string(),
//   description: z.string(),
//   status: z.string(),
//   priority: z.string(),
//   category: z.string(),
//   subcategory: z.string().optional(),
//   assignmentGroup: z.string().optional(),
//   assignedTo: z.string().optional(),
//   businessService: z.string(),
//   reportedById: z.string(),
//   reportedBy: z.string(),
//   createdAt: z.string()
// })

const columns: ColumnDef<IncidentWithDetails>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select ticket ${row.original.number}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="text-primary hover:text-primary/80 font-medium">
            {row.original.number}
          </span>
          {row.original.slaBreachTime &&
            row.original.slaBreachTime < new Date() && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="w-36">{row.original.title}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p>{row.original.category}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.subcategory}
        </p>
      </div>
    ),
  },
  // {
  //   accessorKey: "businessService",
  //   header: "Business Service",
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="text-muted-foreground px-1.5">
  //       {row.original.businessService}
  //     </Badge>
  //   ),
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === IncidentStatus.RESOLVED ||
        row.original.status === IncidentStatus.CLOSED ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : row.original.status === IncidentStatus.CANCELLED ? (
          <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
        ) : row.original.status === IncidentStatus.ON_HOLD ? (
          <IconAlertCircleFilled className="fill-yellow-500 dark:fill-yellow-400" />
        ) : (
          <IconLoader />
        )}
        {getIncidentStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge
        className={`${getPriorityColor(
          row.original.priority as Priority
        )} px-1.5`}
      >
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "assignmentGroup",
    header: "Assignment Group",
    cell: ({ row }) => {
      const isAssigned = row.original.assignmentGroup !== "";

      
      if (isAssigned) {
        return (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground font-medium">
              {row.original.assignmentGroup}
            </span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const isAssigned = row.original.assignedTo !== null;

      if (isAssigned) {
        return (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground font-medium">
              {row.original.assignedTo?.name}
            </span>
          </div>
        );
      }

      return (
        <>
          <Label
            htmlFor={`${row.original.id}-assignedToId`}
            className="sr-only"
          >
            Assigned To
          </Label>
          <Select>
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-assignedToId`}
            >
              <SelectValue placeholder="Assign to user" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Service Desk">Service Desk User</SelectItem>
              <SelectItem value="IT Support">IT Support User</SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default columns;
