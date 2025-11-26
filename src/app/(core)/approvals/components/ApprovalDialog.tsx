"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PendingApproval } from "../services/approval.service";
import { useState } from "react";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approval: PendingApproval;
  action: "approve" | "reject";
  onSubmit: (justification?: string) => void;
}

export function ApprovalDialog({
  open,
  onOpenChange,
  approval,
  action,
  onSubmit,
}: ApprovalDialogProps) {
  const [justification, setJustification] = useState("");

  const handleSubmit = () => {
    if (action === "reject" && !justification.trim()) {
      return; // Reject requires justification
    }
    onSubmit(action === "reject" ? justification : undefined);
    setJustification("");
  };

  const handleClose = () => {
    setJustification("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "approve" ? "Approve Request" : "Reject Request"}
          </DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? `Are you sure you want to approve request ${approval.request.number}?`
              : `Please provide a justification for rejecting request ${approval.request.number}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium mb-1">Request Details</p>
            <p className="text-sm text-muted-foreground">
              {approval.request.title}
            </p>
          </div>

          {action === "reject" && (
            <div className="space-y-2">
              <Label htmlFor="justification">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="justification"
                placeholder="Enter reason for rejection..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Justification is required for rejection
              </p>
            </div>
          )}

          {action === "approve" && (
            <div className="space-y-2">
              <Label htmlFor="justification">Justification (Optional)</Label>
              <Textarea
                id="justification"
                placeholder="Add optional notes..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button size="sm" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            variant={action === "approve" ? "default" : "destructive"}
            disabled={action === "reject" && !justification.trim()}
          >
            {action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
