import React from "react";

type SettingsHeaderProps = {
  title: string;
  description: string;
};

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-row items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 text-sm font-normal">{description}</p>
      </div>
    </div>
  );
};
