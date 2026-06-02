import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useNotifications } from '@/features/communication/hooks/useNotifications';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { formatDateTime } from '@/utils/dateFormatter';
import { getNotificationTheme, getNotificationIcon } from '@/utils/notificationTheme';


export const NotificationDropdown: React.FC = () => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const { selectedSegment, isGlobalView } = useMarketSegment();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useClickOutside(() => setShowNotifications(false), showNotifications);

    const handleToggleNotifications = async () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            await markAllAsRead();
        }
    };

    // Get the display segment name
    const segmentName = isGlobalView ? 'Global' : (selectedSegment?.name || 'Market');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggleNotifications}
                className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-2xl relative transition-all"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-2xs flex items-center justify-center rounded-full border-2 border-white font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-3 w-screen max-w-sm sm:w-80 bg-white border border-gray-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Notification Hub</span>
                            <span className="text-2xs text-gray-400">{segmentName}</span>
                        </div>
                        {!isGlobalView && selectedSegment && (
                            <p className="text-2xs text-gray-500 mt-2">
                                Showing alerts for <span className="font-semibold">{selectedSegment.name}</span> market
                            </p>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length > 0 ? notifications.slice(0, 10).map(n => {
                            const theme = getNotificationTheme(n.type);
                            const notificationSegment = n.marketSegment?.name || 'Global';
                            return (
                              <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-3">
                                <div className={`mt-0.5 rounded-full p-1 h-fit ${theme.badgeBg}`}>
                                  {getNotificationIcon(n.type, 14)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-2">
                                    <p className="text-xs font-bold text-gray-900">{n.title}</p>
                                    {n.marketSegmentId && isGlobalView && (
                                        <span className="text-3xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{notificationSegment}</span>
                                    )}
                                  </div>
                                  <p className="text-xs+ text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                                  <p className="text-3xs text-gray-400 mt-2 font-mono uppercase">{formatDateTime(n.timestamp)}</p>
                                </div>
                              </div>
                            );
                        }) : (
                            <div className="p-10 text-center text-gray-400 text-xs italic">
                                {isGlobalView ? 'No alerts.' : `No alerts for ${selectedSegment?.name || 'this market'}.`}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};