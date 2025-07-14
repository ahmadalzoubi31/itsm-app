export enum EmailTemplateTypeEnum {
    INCIDENT_NOTIFICATION = "INCIDENT_NOTIFICATION",
    SERVICE_REQUEST_NOTIFICATION = "SERVICE_REQUEST_NOTIFICATION",
    USER_WELCOME = "USER_WELCOME",
    PASSWORD_RESET = "PASSWORD_RESET",
    SYSTEM_MAINTENANCE = "SYSTEM_MAINTENANCE"
  }
  

export const EMAIL_TEMPLATE_TYPES = [
    {
      value: EmailTemplateTypeEnum.INCIDENT_NOTIFICATION,
      label: "Incident Notification",
      description: "Template for incident-related notifications",
      variables: ["incidentId", "title", "description", "priority", "assignee", "reporter", "timestamp"]
    },
    {
      value: EmailTemplateTypeEnum.SERVICE_REQUEST_NOTIFICATION,
      label: "Service Request Notification",
      description: "Template for service request notifications",
      variables: ["requestId", "title", "description", "requester", "approver", "status", "timestamp"]
    },
    {
      value: EmailTemplateTypeEnum.USER_WELCOME,
      label: "User Welcome",
      description: "Welcome email for new users",
      variables: ["firstName", "lastName", "username", "email", "role", "loginUrl"]
    },
    {
      value: EmailTemplateTypeEnum.PASSWORD_RESET,
      label: "Password Reset",
      description: "Password reset instructions",
      variables: ["firstName", "lastName", "resetLink", "expirationTime"]
    },
    {
      value: EmailTemplateTypeEnum.SYSTEM_MAINTENANCE,
      label: "System Maintenance",
      description: "System maintenance notifications",
      variables: ["maintenanceTitle", "description", "startTime", "endTime", "impact"]
    }
  ];