export type CreateServiceDto = {
  key: string;
  name: string;
  description?: string | null;
  businessLineId: string;
  categoryId: string;
  subcategoryId: string;
};

export type UpdateServiceDto = Partial<CreateServiceDto>;
