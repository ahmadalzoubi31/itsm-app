import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

type IntegrationCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
};

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  icon,
  title,
  description,
  link,
}) => {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group p-6">
        <div className="flex items-start justify-between">
          <div className="bg-gray-900 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
        <div className="mt-4">
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};
