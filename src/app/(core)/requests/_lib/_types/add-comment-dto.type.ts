/**
 * DTO for adding a comment
 */
export type CreateCommentDto = {
  body: string;
  isPrivate?: boolean;
};
