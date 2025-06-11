import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { User, Users } from 'lucide-react'
import { UserRole } from '@/types/globals' 
import { toast } from 'sonner'

interface ReassignIncidentDialogProps {
  incidentId: string
  incidentNumber: string
  currentAssignee?: string
  onReassign: (data: ReassignmentData) => void
  trigger?: React.ReactNode
}

export interface ReassignmentData {
  assignedToId: string
  assignmentGroup: string
  reason: string
}

// Mock users and groups for demo
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

export function ReassignIncidentDialog({ 
  incidentId, 
  incidentNumber, 
  currentAssignee, 
  onReassign, 
  trigger 
}: ReassignIncidentDialogProps) {
  const [open, setOpen] = useState(false)
  const [assignedToId, setAssignedToId] = useState('')
  const [assignmentGroup, setAssignmentGroup] = useState('')
  const [reason, setReason] = useState('')

  const handleReassign = () => {
    if (!assignedToId && !assignmentGroup) {
        toast.error("Please select either a user or assignment group")  
      
      return
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for reassignment")
      return
    }

    onReassign({
      assignedToId,
      assignmentGroup,
      reason
    })

    // Reset form
    setAssignedToId('')
    setAssignmentGroup('')
    setReason('')
    setOpen(false)

    toast.success(`Incident ${incidentNumber} has been reassigned`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Reassign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign Incident {incidentNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {currentAssignee && (
            <div className="text-sm text-gray-600">
              Currently assigned to: <span className="font-medium">{currentAssignee}</span>
            </div>
          )}

          <div>
            <Label htmlFor="assignee">Assign to User</Label>
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
            <Label htmlFor="group">Assignment Group</Label>
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
            <Label htmlFor="reason">Reason for Reassignment</Label>
            <Textarea
              id="reason"
              placeholder="Explain why you're reassigning this incident..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassign}>
              Reassign Incident
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}