"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  IconTextCaption,
  IconCalendar,
  IconSelector,
  IconCircleDot,
  IconSquareCheck,
  IconLink,
  IconUpload,
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconUser,
  IconShield,
} from "@tabler/icons-react";
import { Button } from "./ui/button";

const elementCategories = [
  {
    title: "Popular elements",
    isOpen: true,
    items: [
      { icon: IconTextCaption, label: "Text Input" },
      { icon: IconCalendar, label: "Date Picker" },
      { icon: IconSelector, label: "Dropdown" },
      { icon: IconCircleDot, label: "Single Choice" },
      { icon: IconSquareCheck, label: "Multiple Choice" },
      { icon: IconLink, label: "URL" },
      { icon: IconUpload, label: "File Uploader" },
    ],
  },
  {
    title: "Contact elements",
    isOpen: false,
    items: [
      { icon: IconMail, label: "Email" },
      { icon: IconPhone, label: "Phone" },
      { icon: IconMapPin, label: "Address" },
      { icon: IconUser, label: "Name" },
    ],
  },
  {
    title: "Advanced elements",
    isOpen: false,
    items: [
      { icon: IconClock, label: "Time Picker" },
      { icon: IconShield, label: "Password" },
      { icon: IconSelector, label: "Multi-select" },
    ],
  },
];

export function ContentPickerSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    "Popular elements": true,
    "Contact elements": false,
    "Advanced elements": false,
  });

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  return (
    <Sidebar className="border-r bg-white" {...props}>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Elements</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <div className="flex flex-col">
          {elementCategories.map((category) => (
            <div
              key={category.title}
              className="border-b border-gray-100 last:border-b-0"
            >
              {/* Section Header */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleSection(category.title)}
              >
                <span>{category.title}</span>
                {openSections[category.title] ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Button>

              {/* Section Items */}
              {openSections[category.title] && (
                <div className="pb-2">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-gray-500" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
