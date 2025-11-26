"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Lock, Globe, Paperclip, X } from "lucide-react";
import { format } from "date-fns";
import {
  useCaseComments,
  useAddCaseComment,
  useUploadCaseAttachment,
} from "../hooks/useCases";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/app/auth/hooks/useCurrentUser";

interface CaseCommentsProps {
  caseId: string;
  requesterId?: string;
}

export function CaseComments({ caseId, requesterId }: CaseCommentsProps) {
  const { comments, isLoading, refetch } = useCaseComments(caseId);
  const { mutate: addComment, isPending } = useAddCaseComment();
  const { mutate: uploadAttachment, isPending: isUploading } =
    useUploadCaseAttachment();
  const { user: currentUser } = useCurrentUser();
  const [commentBody, setCommentBody] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file sizes (10MB max each)
    const invalidFiles = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Some files are too large", {
        description: "Maximum file size is 10MB per file",
      });
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    addComment(
      { caseId, data: { body: commentBody, isPrivate } },
      {
        onSuccess: async () => {
          // Upload attachments if any
          if (selectedFiles.length > 0) {
            let uploadedCount = 0;
            for (const file of selectedFiles) {
              await new Promise<void>((resolve) => {
                uploadAttachment(
                  { caseId, file },
                  {
                    onSuccess: () => {
                      uploadedCount++;
                      resolve();
                    },
                    onError: (error) => {
                      toast.error(`Failed to upload ${file.name}`, {
                        description: error.message,
                      });
                      resolve();
                    },
                  }
                );
              });
            }

            if (uploadedCount > 0) {
              toast.success(
                `Comment added with ${uploadedCount} attachment(s)`
              );
            }
          } else {
            toast.success("Comment added successfully");
          }

          setCommentBody("");
          setIsPrivate(true);
          setSelectedFiles([]);
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to add comment", {
            description: error.message,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet</p>
            </div>
          ) : (
            comments.map((comment) => {
              // Check if comment was created by the requester
              const isRequesterComment =
                requesterId && comment.createdById === requesterId;

              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {comment.createdByName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.createdByName || "Unknown User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "PPp")}
                      </span>
                      {/* Hide visibility tag if comment is from requester */}
                      {!isRequesterComment && (
                        <>
                          {comment.isPrivate ? (
                            <div className="flex items-center gap-1 text-xs text-orange-600">
                              <Lock className="h-3 w-3" />
                              <span>Private (Staff Only)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Globe className="h-3 w-3" />
                              <span>Shared with Requester</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-sm bg-muted rounded-lg p-3">
                      {comment.body}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            rows={3}
            disabled={isPending || isUploading}
          />

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground text-xs flex-shrink-0">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    disabled={isPending || isUploading}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrivate"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked === true)}
                  disabled={isPending || isUploading}
                />
                <Label
                  htmlFor="isPrivate"
                  className="text-sm font-normal cursor-pointer flex items-center gap-1"
                >
                  <Lock className="h-3 w-3" />
                  Keep comment private (only visible to staff/agents)
                </Label>
              </div>

              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending || isUploading}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Attach Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx,.xls,.xlsx"
              />
            </div>

            <Button
              size="sm"
              type="submit"
              disabled={!commentBody.trim() || isPending || isUploading}
            >
              <Send className="h-4 w-4 mr-2" />
              {isPending || isUploading ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
