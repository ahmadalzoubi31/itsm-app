import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "../../../../utils/cn";

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
      <div
        className={cn(
          "rounded-lg shadow-sm border transition-all duration-300 cursor-pointer group p-6",
          "bg-card",
          "border-border",
          "hover:shadow-md"
        )}
      >
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300",
              "bg-primary",
              "text-primary-foreground"
            )}
          >
            {icon}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" />
        </div>
        <div className="mt-4">
          <h4 className="text-base font-semibold text-card-foreground">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};
