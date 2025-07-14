"use client";

import { ContentPickerSidebar } from "@/components/content-picker-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DesignDemo() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-4 lg:px-6 py-4 border-b bg-white">
        <div className="text-2xl font-bold tracking-tight">
          Design Demo
          <div className="text-muted-foreground text-sm font-normal">
            Screenshot vs Current Sidebar Design
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* New Minimal Sidebar */}
        <ContentPickerSidebar className="w-64 flex-shrink-0" />
        
        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <p className="text-muted-foreground">
                The left sidebar shows the minimal design from your screenshot with collapsible sections and clean styling.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Screenshot Design (Left Sidebar)</CardTitle>
                  <CardDescription>
                    Clean, minimal content picker style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pure white background</li>
                      <li>• Simple icon + text layout</li>
                      <li>• Collapsible sections with chevrons</li>
                      <li>• Minimal hover states</li>
                      <li>• Clean typography</li>
                      <li>• Content/element picker focused</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Current Design</CardTitle>
                  <CardDescription>
                    Navigation-focused with complex styling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Complex SidebarMenuButton components</li>
                      <li>• Primary colored Quick Create button</li>
                      <li>• Role-based permissions</li>
                      <li>• Tooltip functionality</li>
                      <li>• Navigation menu pattern</li>
                      <li>• Multiple sections and groupings</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Usage Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The left sidebar now shows the minimal design from your screenshot. You can:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Click section headers to expand/collapse</li>
                    <li>• Hover over elements to see the subtle interactions</li>
                    <li>• Compare with your current navigation sidebar</li>
                  </ul>
                  <div className="pt-4">
                    <Button>
                      Integrate This Design
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 