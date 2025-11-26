export type Service = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  businessLineId: string;
  categoryId: string;
  subcategoryId: string;

  createdAt: string;
  createdByName?: string;
  updatedAt: string;
  updatedByName?: string;
};
