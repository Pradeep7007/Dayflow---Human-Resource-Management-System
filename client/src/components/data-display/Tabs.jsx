import React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={cn('df-tabs-header', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn('df-tab-btn', isActive && 'df-tab-btn--active')}
            aria-selected={isActive}
            role="tab"
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <Badge variant={isActive ? 'primary' : 'neutral'} size="sm">
                {tab.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
};
