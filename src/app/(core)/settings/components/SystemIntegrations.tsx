import { Users, Clock, Workflow } from "lucide-react";
import { IntegrationCard } from "./IntegrationCard";
import { cn } from "@/lib/utils/cn";
 
type Integration = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

export const SystemIntegrations = () => {
  const integrations: Integration[] = [
    {
      id: "ldap",
      // icons keep size only; color will be provided by the card theme
      icon: <Users className="w-6 h-6" />,
      title: "LDAP Management",
      description: "Configure LDAP authentication and manage user synchronization",
      link: "/settings/ldap",
    },
    {
      id: "email",
      icon: <Clock className="w-6 h-6" />,
      title: "Email Management",
      description: "Configure email templates and notification schedules",
      link: "/settings/emails",
    },
    {
      id: "workflow",
      icon: <Workflow className="w-6 h-6" />,
      title: "Workflow Management",
      description: "Configure workflow templates and notification schedules",
      link: "/settings/workflows",
    },
  ];

  return (
    <div className="mb-12">
      <h3 className={cn("text-lg font-semibold mb-6 flex items-center gap-2", "text-foreground")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-activity"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        System Integrations
      </h3>
      <div className="grid gap-6 md:grid-cols-3">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            icon={integration.icon}
            title={integration.title}
            description={integration.description}
            link={integration.link}
          />
        ))}
      </div>
    </div>
  );
};
