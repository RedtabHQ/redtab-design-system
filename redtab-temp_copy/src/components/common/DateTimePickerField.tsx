import React, { useRef, useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

interface DateTimePickerFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  showTime?: boolean;
  dateFormat?: string;
  value?: string | Date;
  onChange?: (value: string) => void;
  variant?: 'default' | 'compact';
  inputClassName?: string;
  calendarClassName?: string;
  timezone?: string; // IANA string, e.g. 'Asia/Ho_Chi_Minh'. If not set, component uses local browser time.
}

const DateTimePickerField = React.forwardRef<HTMLInputElement, DateTimePickerFieldProps>(
  ({ label, error, showTime = false, dateFormat, value, onChange, variant = 'default', inputClassName, calendarClassName, timezone, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const DEFAULT_DATE_FORMAT = showTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
    const DISPLAY_FORMAT = showTime ? 'MMM dd, yyyy HH:mm' : 'MMM dd, yyyy';
    const finalDateFormat = dateFormat || DEFAULT_DATE_FORMAT;

    // Initialize from value prop
    useEffect(() => {
      if (value) {
        let dateObj: Date;
        if (timezone) {
          // Value is a UTC ISO string - convert to user's local timezone for display
          dateObj = toZonedTime(new Date(String(value)), timezone);
        } else {
          dateObj = value instanceof Date ? value : parse(String(value), finalDateFormat, new Date());
        }
        setSelectedDate(dateObj);
        setInputValue(format(dateObj, DISPLAY_FORMAT));
      }
    }, [value, finalDateFormat, DISPLAY_FORMAT, timezone]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      try {
        const parsedDate = parse(val, DISPLAY_FORMAT, new Date());
        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
          if (timezone) {
            const utcDate = fromZonedTime(parsedDate, timezone);
            onChange?.(utcDate.toISOString());
          } else {
            onChange?.(format(parsedDate, finalDateFormat));
          }
        }
      } catch {
        // Invalid date format, user is still typing
      }
    };

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setInputValue(format(date, DISPLAY_FORMAT));
      if (timezone) {
        const utcDate = fromZonedTime(date, timezone);
        onChange?.(utcDate.toISOString());
      } else {
        onChange?.(format(date, finalDateFormat));
      }
      setIsOpen(false);
    };

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const [calendarMonth, setCalendarMonth] = useState<Date | null>(null);
    const currentMonthDisplay = calendarMonth || selectedDate || new Date();
    const daysInMonth = getDaysInMonth(currentMonthDisplay);
    const firstDay = getFirstDayOfMonth(currentMonthDisplay);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    const previousMonth = new Date(currentMonthDisplay.getFullYear(), currentMonthDisplay.getMonth() - 1);
    const nextMonth = new Date(currentMonthDisplay.getFullYear(), currentMonthDisplay.getMonth() + 1);

    const variantStyles = {
      default: 'px-6 py-4 bg-gray-50 border rounded-2xl text-sm shadow-inner',
      compact: 'px-3 py-2 bg-white border rounded text-xs shadow-sm',
    };

    const baseLabelClass = "text-2xs font-black text-gray-400 uppercase tracking-widest";
    const labelClass = variant === 'default'
      ? `${baseLabelClass} px-1 group-focus-within:text-redtab transition-colors`
      : baseLabelClass;

    const baseInputClass = variantStyles[variant];
    const finalInputClass = inputClassName || `${baseInputClass} border-gray-100 focus:border-red-100 focus:ring-4 focus:ring-red-50/50`;

    return (
      <div ref={containerRef} className="relative space-y-2 group">
        {label &&
          <label className={labelClass}>
            {label}
          </label>
        }

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={showTime ? 'MMM dd, yyyy HH:mm' : 'MMM dd, yyyy'}
            className={`w-full font-bold outline-none focus:bg-white transition-all pr-12 ${finalInputClass} ${error
                ? 'border-red-300 focus:ring-4 focus:ring-red-50/50 focus:border-red-100'
                : ''
              }`}
            {...props}
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {showTime ? <Clock size={18} /> : <Calendar size={18} />}
          </div>
        </div>

        {/* Calendar Picker */}
        {isOpen && (
          <div className={calendarClassName || "absolute top-full left-0 mt-2 w-80 bg-white border border-gray-100 rounded shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200"}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarMonth(previousMonth)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
              >
                ←
              </button>
              <div className="text-sm font-bold text-gray-900">
                {format(currentMonthDisplay, 'MMMM yyyy')}
              </div>
              <button
                onClick={() => setCalendarMonth(nextMonth)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
              >
                →
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-2xs font-bold text-gray-400 uppercase py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const dateObj = new Date(currentMonthDisplay.getFullYear(), currentMonthDisplay.getMonth(), day);
                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonthDisplay.getMonth() &&
                  selectedDate.getFullYear() === currentMonthDisplay.getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(dateObj)}
                    className={`aspect-square rounded-lg text-xs font-bold transition-all ${isSelected
                        ? 'bg-redtab text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                      }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Time Picker (if showTime) */}
            {showTime && selectedDate && (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1 block">
                      Hour
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={String(selectedDate.getHours()).padStart(2, '0')}
                      onChange={(e) => {
                        const hours = Math.max(0, Math.min(23, parseInt(e.target.value) || 0));
                        const newDate = new Date(selectedDate);
                        newDate.setHours(hours);
                        handleDateSelect(newDate);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-redtab outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1 block">
                      Minute
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={String(selectedDate.getMinutes()).padStart(2, '0')}
                      onChange={(e) => {
                        const minutes = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                        const newDate = new Date(selectedDate);
                        newDate.setMinutes(minutes);
                        handleDateSelect(newDate);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-redtab outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

DateTimePickerField.displayName = 'DateTimePickerField';

export default DateTimePickerField;
export type { DateTimePickerFieldProps };
