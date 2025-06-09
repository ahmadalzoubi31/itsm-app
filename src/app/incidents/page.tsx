'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import IncidentList from '@/components/incidents/IncidentList'  
import { BulkReassignDialog } from '@/components/incidents/BulkReassignDialog'
import { Search, Filter, Plus } from 'lucide-react'
import { IncidentWithDetails, UserRole, ReassignmentData, IncidentStatus, Priority, Impact, Urgency } from '@/types/globals'


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

const Index = () => {
  const router = useRouter()
  const [incidents] = useState<IncidentWithDetails[]>(mockIncidents )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([])
  const [showBulkReassign, setShowBulkReassign] = useState(false)

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

    const handleBulkReassign = (data: ReassignmentData) => {
    console.log('Bulk reassigning incidents:', selectedIncidents, 'to:', data.assignedToId, 'group:', data.assignmentGroup, 'reason:', data.reason)
    setSelectedIncidents([])
    setShowBulkReassign(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Incident Management Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage IT incidents following ITIL v4 best practices
            </p>
          </div>
          <Button onClick={() => router.push('/incidents/create')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Incident
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold text-gray-800">Open Incidents</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">{incidents.filter(i => i.status !== IncidentStatus.CLOSED).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold text-gray-800">Incidents Due Today</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">{incidents.filter(i => i.slaBreachTime! < new Date(Date.now() + 24 * 60 * 60 * 1000)).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold text-gray-800">Average Resolution Time</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">3.5 hours</p>
        </div>
      </div>

      {/* Incident List */}
      <IncidentList
        incidents={filteredIncidents}
      />

      {/* Bulk Actions */}
      {selectedIncidents.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedIncidents.length} incident{selectedIncidents.length > 1 ? 's' : ''} selected
            </span>
            <Button
              size="sm"
              onClick={() => setShowBulkReassign(true)}
            >
              Bulk Reassign
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIncidents([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <BulkReassignDialog
        open={showBulkReassign}
        onOpenChange={setShowBulkReassign}
        selectedIncidents={selectedIncidents.map(id => {
          const incident = incidents.find(i => i.id === id)
          return {
            id: incident?.id || '',
            number: incident?.number || '',
            title: incident?.title || ''
          }
        })}
        onBulkReassign={handleBulkReassign}
      />
    </div>
  )
}

export default Index
