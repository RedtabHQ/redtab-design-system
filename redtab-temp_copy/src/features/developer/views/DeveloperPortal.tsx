import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Code, Webhook, ScrollText, Code2Icon } from 'lucide-react';

export default function DeveloperPortal() {
  const location = useLocation();

  // Redirect to API keys if on base /developer route
  if (location.pathname === '/developer') {
    return <Navigate to="/developer/api-keys" replace />;
  }

  const tabs = [
    { name: 'API Keys', href: '/developer/api-keys', icon: Code },
    { name: 'Webhooks', href: '/developer/webhooks', icon: Webhook },
    { name: 'Webhook Logs', href: '/developer/webhook-logs', icon: ScrollText },
  ];

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          <Code2Icon className="inline-block mr-2 text-redtab" size={30} strokeWidth={1.5} />
          Developer Portal</h1>
        <p className="mt-2 text-gray-600">
          Manage your API keys and webhook configurations
        </p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-redtab text-redtab'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <Outlet />
    </div>
  );
}
