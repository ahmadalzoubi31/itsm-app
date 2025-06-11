'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { X, Filter as FilterIcon, Search } from 'lucide-react';
import { IncidentStatus, Priority } from '@/types/globals';
import { cn } from '@/lib/utils';

interface TicketConsoleFiltersProps {
  filters: {
    search: string;
    statuses: string[];
    priorities: string[];
    assignedToMe: boolean;
    overdueOnly: boolean;
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export function TicketConsoleFilters({ filters, onFiltersChange, onReset }: TicketConsoleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const togglePriority = (priority: string) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const statuses = Object.values(IncidentStatus);
  const priorities = Object.values(Priority);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tickets..."
          className="w-full pl-8"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Filters
              {(filters.statuses.length > 0 || filters.priorities.length > 0 || filters.assignedToMe || filters.overdueOnly) && (
                <Badge variant="secondary" className="px-1.5 py-0.5">
                  {filters.statuses.length + filters.priorities.length + (filters.assignedToMe ? 1 : 0) + (filters.overdueOnly ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge
                      key={status}
                      variant={filters.statuses.includes(status) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer',
                        filters.statuses.includes(status) && 'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                      onClick={() => toggleStatus(status)}
                    >
                      {status.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((priority) => (
                    <Badge
                      key={priority}
                      variant={filters.priorities.includes(priority) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer',
                        filters.priorities.includes(priority) && 'bg-primary/10 text-primary hover:bg-primary/20'
                      )}
                      onClick={() => togglePriority(priority)}
                    >
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="assignedToMe"
                    checked={filters.assignedToMe}
                    onChange={(e) => onFiltersChange({ ...filters, assignedToMe: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="assignedToMe" className="text-sm font-medium leading-none">
                    Assigned to me
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="overdueOnly"
                    checked={filters.overdueOnly}
                    onChange={(e) => onFiltersChange({ ...filters, overdueOnly: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="overdueOnly" className="text-sm font-medium leading-none">
                    Overdue only
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button type="button" size="sm" onClick={() => setIsOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {(filters.statuses.length > 0 || filters.priorities.length > 0 || filters.assignedToMe || filters.overdueOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
