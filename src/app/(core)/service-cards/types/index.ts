import { BaseEntity } from "@/types/globals";

export type ServiceCard = BaseEntity & {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedTime: string;
  price: string;
  workflowId: string;
  icon: any;
  isActive: boolean;
};
