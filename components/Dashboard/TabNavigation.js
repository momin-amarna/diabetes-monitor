import { useState } from 'react';

export default function TabNavigation({ onTabChange, defaultTab = 'blood-sugar' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    { id: 'blood-sugar', label: 'السكر', icon: '🩸' },
    { id: 'weight', label: 'الوزن', icon: '⚖️' },
    { id: 'statistics', label: 'الإحصائيات', icon: '📊' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <nav className="flex gap-2 bg-white border-b border-gray-200 sticky top-0 z-10 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            flex-1 min-w-max px-4 py-4 text-center font-medium text-lg
            transition-colors duration-200 min-h-touch min-w-touch
            ${
              activeTab === tab.id
                ? 'text-green-600 border-b-4 border-green-600'
                : 'text-gray-600 border-b-4 border-transparent hover:text-gray-800'
            }
          `}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          <span className="text-2xl block mb-1">{tab.icon}</span>
          <span className="text-sm">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
