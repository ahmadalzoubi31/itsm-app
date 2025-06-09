import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Users } from 'lucide-react'
import { UserRole } from '@/types/globals'
import { toast } from 'sonner'

export interface ReassignmentData {
  assignedToId?: string
  assignmentGroup?: string
  reason: string
}

interface BulkReassignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIncidents: Array<{ id: string; number: string; title: string }>
  onBulkReassign: (data: ReassignmentData) => void
}

// Mock users and groups
const mockUsers = [
  { id: '1', name: 'John Doe', role: UserRole.SERVICE_DESK, email: 'john@example.com', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Jane Smith', role: UserRole.MANAGER, email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Mike Johnson', role: UserRole.SERVICE_DESK, email: 'mike@example.com', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', name: 'Sarah Wilson', role: UserRole.ADMIN, email: 'sarah@example.com', createdAt: new Date(), updatedAt: new Date() },
]

const mockGroups = [
  'Infrastructure Team',
  'Application Support', 
  'Network Team',
  'Security Team',
  'Level 2 Support',
  'Level 3 Support'
]

export function BulkReassignDialog({ 
  open, 
  onOpenChange, 
  selectedIncidents, 
  onBulkReassign 
}: BulkReassignDialogProps) {
  const [assignedToId, setAssignedToId] = useState('')
  const [assignmentGroup, setAssignmentGroup] = useState('')
  const [reason, setReason] = useState('')

  const handleBulkReassign = () => {
    if (!assignedToId && !assignmentGroup) {
      toast.error("Please select either a user or assignment group")
      return
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for reassignment")
      return
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for reassignment")
      return
    }

    onBulkReassign({
      assignedToId,
      assignmentGroup,
      reason
    })

    // Reset form
    setAssignedToId('')
    setAssignmentGroup('')
    setReason('')
    onOpenChange(false)

    toast.success(`${selectedIncidents.length} incidents have been reassigned`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Reassign Incidents</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Selected Incidents ({selectedIncidents.length})</Label>
            <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
              {selectedIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{incident.number}</Badge>
                  <span className="truncate">{incident.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="bulk-assignee">Assign to User</Label>
            <Select value={assignedToId} onValueChange={setAssignedToId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user.name} ({user.role})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bulk-group">Assignment Group</Label>
            <Select value={assignmentGroup} onValueChange={setAssignmentGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {mockGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bulk-reason">Reason for Reassignment</Label>
            <Textarea
              id="bulk-reason"
              placeholder="Explain why you're reassigning these incidents..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkReassign}>
              <Users className="h-4 w-4 mr-2" />
              Reassign {selectedIncidents.length} Incidents
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}