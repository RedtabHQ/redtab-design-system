# DateTimePickerField Component

Reusable datetime/date picker component with consistent styling across the application.

## Components

### 1. DateTimePickerField
Standalone component for basic datetime/date picking.

**Props:**
- `label` (string, required) - Field label
- `error` (string, optional) - Error message to display
- `showTime` (boolean, default: false) - Show time picker (hour/minute)
- `dateFormat` (string, optional) - Format for storing date value (e.g., 'yyyy-MM-dd HH:mm')
- `value` (string | Date, optional) - Current selected value
- `onChange` (function, optional) - Callback when date changes
- Inherits from `HTMLInputElement` attributes

**Example:**
```tsx
import DateTimePickerField from '@/components/DateTimePickerField';

function MyComponent() {
  const [date, setDate] = useState('');

  return (
    <DateTimePickerField
      label="Select Date"
      value={date}
      onChange={(value) => setDate(value)}
      showTime={false}
    />
  );
}
```

### 2. FormDateTimeField
React Hook Form integrated component for forms.

**Props:**
- `name` (string, required) - Field name in form
- `control` (Control, required) - Form control from useForm
- `label` (string, required) - Field label
- `placeholder` (string, optional) - Input placeholder
- `required` (boolean, default: false) - Whether field is required
- `disabled` (boolean, default: false) - Whether field is disabled
- `showTime` (boolean, default: false) - Show time picker
- `dateFormat` (string, optional) - Date format for storing value
- `rules` (RegisterOptions, optional) - Form validation rules
- `helperText` (string, optional) - Helper text below field
- `className` (string, optional) - Additional CSS classes

**Example:**
```tsx
import { useForm } from 'react-hook-form';
import { FormDateTimeField } from '@/components/form/FormDateTimeField';

function MyForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
    }
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormDateTimeField
        name="startDate"
        control={control}
        label="Start Date"
        required={true}
        rules={{
          required: 'Start date is required',
          validate: (value) => {
            // Custom validation
            return true;
          }
        }}
      />
      <FormDateTimeField
        name="endDate"
        control={control}
        label="End Date"
        required={true}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Styling

The component follows the project's design system:
- **Label**: Small uppercase text with redtab accent on focus
  - `text-[10px] font-black text-gray-400 uppercase tracking-widest`
- **Input**: Rounded-2xl with light gray background
  - `px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl`
- **Focus State**: White background with light red ring
  - `focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50/50`
- **Error State**: Red border and ring
  - `border-red-300 focus:ring-red-50/50 focus:border-red-100`
- **Calendar Picker**: Dropdown calendar with month navigation
- **Icon**: Calendar or Clock icon (Lucide React)

## Features

- ✅ Date-only or datetime (with time) picker
- ✅ Calendar with month navigation
- ✅ Custom hour/minute input for datetime mode
- ✅ Click-outside detection to close picker
- ✅ Consistent with InputField styling
- ✅ Error state support
- ✅ React Hook Form integration
- ✅ Format customization via `dateFormat` prop
- ✅ Display format separate from storage format

## Integration in Filter Components

For adding to existing filter components like `GenericFilterBar` or `AuditLogFilters`:

```tsx
// In GenericFilterBar.tsx - replace existing date input
{field.type === 'dateTime' && (
  <FormDateTimeField
    name={field.key}
    control={control}
    label={field.label}
    showTime={field.showTime === true}
    rules={{
      required: field.required ? `${field.label} is required` : undefined
    }}
  />
)}
```

## Date Format Examples

- `'yyyy-MM-dd'` - 2024-12-23
- `'yyyy-MM-dd HH:mm'` - 2024-12-23 14:30
- `'MMM dd, yyyy'` - Dec 23, 2024
- `'MMMM d, yyyy h:mm a'` - December 23, 2024 2:30 PM

Formats use `date-fns` pattern (not moment.js format).

## CSS Classes for Customization

If you need to customize styling, modify the Tailwind classes in:
1. `DateTimePickerField.tsx` - Main component styling
2. Calendar grid styling: `grid grid-cols-7 gap-1`
3. Selected day styling: `bg-redtab text-white shadow-lg`
4. Hover day styling: `hover:bg-gray-50 border-gray-200`

## Performance Considerations

- Component uses `useRef` for click-outside detection
- Event listeners are properly cleaned up on unmount
- Calendar rendering is optimized with array methods
- Consider memoizing if used in large lists with `React.memo()`

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- No IE11 support (not a requirement for modern React 19)

## Dependencies

- `react` (v19+)
- `lucide-react` (for Calendar/Clock icons)
- `date-fns` (v4+) - Already in project
- `react-hook-form` (v7+) - For FormDateTimeField only

No additional dependencies needed - uses existing project packages.
