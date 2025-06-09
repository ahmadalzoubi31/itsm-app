'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./incidentsForDashboard.json"
import { useState } from "react"
import { IncidentWithDetails, IncidentStatus, Priority, Impact, Urgency, UserRole } from "@/types/globals"

// Mock data for demonstration
const mockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  role: UserRole.SERVICE_DESK,
  createdAt: new Date(),
  updatedAt: new Date()
}

const mockIncidents: IncidentWithDetails[] = [
  {
    id: '1',
    number: 'INC001',
    title: 'Email server down',
    description: 'Email server is not responding',
    status: IncidentStatus.NEW,
    priority: Priority.HIGH,
    impact: Impact.HIGH,
    urgency: Urgency.HIGH,
    category: 'Infrastructure',
    subcategory: 'Email',
    reportedById: '1',
    reportedBy: mockUser,
    slaBreachTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    businessService: 'Email Service',
    location: 'Data Center 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    history: [],
    _count: { comments: 0 }
  },
  {
    id: '2',
    number: 'INC002',
    title: 'Network outage in London office',
    description: 'Users in London office cannot access network resources',
    status: IncidentStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    impact: Impact.HIGH,
    urgency: Urgency.MEDIUM,
    category: 'Network',
    subcategory: 'Connectivity',
    reportedById: '1',
    reportedBy: mockUser,
    slaBreachTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    businessService: 'Office Network',
    location: 'London Office',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    history: [],
    _count: { comments: 0 }
  },
  {
    id: '3',
    number: 'INC003',
    title: 'Application error in CRM',
    description: 'Users are experiencing errors when using the CRM application',
    status: IncidentStatus.RESOLVED,
    priority: Priority.LOW,
    impact: Impact.MEDIUM,
    urgency: Urgency.LOW,
    category: 'Application',
    subcategory: 'CRM',
    reportedById: '1',
    reportedBy: mockUser,
    slaBreachTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    businessService: 'Customer Relationship Management',
    location: 'All Locations',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    history: [],
    _count: { comments: 0 }
  },
  {
    id: '4',
    number: 'INC004',
    title: 'VPN connection issues',
    description: 'Users are unable to connect to the VPN',
    status: IncidentStatus.CLOSED,
    priority: Priority.HIGH,
    impact: Impact.HIGH,
    urgency: Urgency.HIGH,
    category: 'Network',
    subcategory: 'VPN',
    reportedById: '1',
    reportedBy: mockUser,
    slaBreachTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    businessService: 'Remote Access',
    location: 'Various',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    history: [],
    _count: { comments: 0 }
  },
  {
    id: '5',
    number: 'INC005',
    title: 'Database server overload',
    description: 'Database server is experiencing high load and slow queries',
    status: IncidentStatus.NEW,
    priority: Priority.HIGH,
    impact: Impact.HIGH,
    urgency: Urgency.HIGH,
    category: 'Infrastructure',
    subcategory: 'Database',
    reportedById: '1',
    reportedBy: mockUser,
    slaBreachTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    businessService: 'All Services',
    location: 'Data Center 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    history: [],
    _count: { comments: 0 }
  }
]

const Page = () => {
  const [incidents] = useState<IncidentWithDetails[]>(mockIncidents)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards incidents={incidents} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page

