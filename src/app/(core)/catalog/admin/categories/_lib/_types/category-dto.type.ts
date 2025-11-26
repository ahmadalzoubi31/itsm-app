// src/app/(core)/catalog/admin/categories/_lib/_types/category-dto.type.ts

export type CreateCategoryDto = {
  key: string;
  name: string;
  description?: string;
  isActive?: boolean;
  businessLineId: string;
  parentId?: string | null;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto> & {
  id?: string;
};
