# DateTimePickerField Component Setup

## Overview

Complete datetime/date picker component implementation with consistent styling across the application. Built using `date-fns` (already in project) without requiring `shadcn-datetime-picker` external package.

## Files Created

### 1. Core Components

#### `DateTimePickerField.tsx` (Standalone Component)
- Location: `/src/components/DateTimePickerField.tsx`
- Reusable datetime/date picker field
- Features:
  - Calendar picker with month navigation
  - Optional time picker (hour/minute)
  - Click-outside detection for closing
  - InputField styling (rounded-2xl, gray-50 background)
  - Icon support (Calendar or Clock)
  - Error state handling
  - Custom date format support

#### `form/FormDateTimeField.tsx` (React Hook Form Integration)
- Location: `/src/components/form/FormDateTimeField.tsx`
- Wraps DateTimePickerField for form integration
- Features:
  - Full react-hook-form Controller integration
  - Validation rules support
  - Error message display
  - All DateTimePickerField props available

### 2. Documentation

#### `README_DateTimePickerField.md`
- Detailed component API documentation
- Usage examples for both standalone and form-integrated usage
- Styling guide
- Integration patterns for existing components
- Date format examples using date-fns

#### `DATETIME_PICKER_SETUP.md` (This File)
- Setup instructions
- File structure
- Quick start guide

### 3. Examples

#### `examples/DateTimePickerExample.tsx`
- Complete working example component
- Demonstrates:
  - Standalone DateTimePickerField usage
  - Form integration with FormDateTimeField
  - Validation
  - Date range selection
  - Form submission handling
- Can be mounted at a route for testing during development

## Styling Consistency

### Input Field Styling Maintained
```
Label: text-[10px] font-black text-gray-400 uppercase tracking-widest
Input: px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl
Focus: focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50/50
Error: border-red-300 with red ring
```

### Calendar Picker Styling
- Month navigation buttons with hover states
- Day grid with 7 columns
- Selected day: `bg-redtab text-white`
- Hover days: `hover:bg-gray-50`
- Responsive width (w-80)

### Time Picker (when enabled)
- Hour/Minute inputs side by side
- Same input styling as main fields
- Validation: Hour 0-23, Minute 0-59

## Usage Guide

### Basic Standalone Usage

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
      dateFormat="yyyy-MM-dd"
    />
  );
}
```

### Form Integration

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

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <FormDateTimeField
        name="startDate"
        control={control}
        label="Start Date"
        showTime={false}
        rules={{
          required: 'Start date is required'
        }}
      />
      <FormDateTimeField
        name="endDate"
        control={control}
        label="End Date"
        showTime={false}
        rules={{
          required: 'End date is required'
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Time Picker

```tsx
<FormDateTimeField
  name="eventDateTime"
  control={control}
  label="Event Date & Time"
  showTime={true}
  dateFormat="yyyy-MM-dd HH:mm"
  rules={{
    required: 'Please select date and time'
  }}
/>
```

## Integration with Existing Components

### GenericFilterBar.tsx
Replace or add datetime support:

```tsx
// In the field type switch statement
{field.type === 'dateTime' && (
  <FormDateTimeField
    name={field.key}
    control={control}
    label={field.label || field.key}
    showTime={field.showTime === true}
  />
)}
```

### AuditLogFilters.tsx
Replace native date inputs:

```tsx
// Before:
<input type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />

// After:
<FormDateTimeField
  name="startDate"
  control={control}
  label="Start Date"
  showTime={false}
/>
```

## Dependencies

**No new dependencies required!** Uses existing packages:
- `react` (v19+) - Already installed
- `date-fns` (v4.1.0) - Already installed
- `react-hook-form` (v7.68.0) - Already installed (FormDateTimeField only)
- `lucide-react` (v0.561.0) - Already installed

**Removed requirement for:**
- `shadcn-datetime-picker` - Not needed, built custom

## Features Implemented

✅ Date-only picker
✅ DateTime picker with separate time inputs
✅ Month navigation (prev/next)
✅ Calendar grid with day selection
✅ Click-outside detection to auto-close
✅ InputField styling consistency
✅ Error state and messages
✅ React Hook Form integration
✅ Custom date format support
✅ Icon support (Calendar/Clock)
✅ Time picker with hour/minute inputs
✅ Validation rules support
✅ Smooth animations (fade-in, slide-in)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ❌ IE11 (not supported - not a requirement)

## Testing

1. Mount the example component:
   ```tsx
   // In your router or dev page
   import DateTimePickerExample from '@/components/examples/DateTimePickerExample';
   // <DateTimePickerExample />
   ```

2. Test date selection
3. Test datetime (with time) selection
4. Test form validation
5. Test error states
6. Test click-outside closing

## Next Steps

1. **Integrate into PolicyConfigView** (if needed for simulation date range)
2. **Update GenericFilterBar** to support dateTime field type
3. **Update AuditLogFilters** to use new component
4. **Add to any form** that needs date/datetime input
5. **Remove example component** after testing (`examples/DateTimePickerExample.tsx`)

## Customization

### Styling Changes
All styling is in Tailwind classes within the component. To customize:

1. **Calendar colors**: Change `bg-redtab` to your accent color
2. **Input styling**: Modify the className in the input element
3. **Calendar size**: Change `w-80` to desired width
4. **Border radius**: Modify `rounded-2xl` values

### Date Format Customization
Pass custom `dateFormat` prop using date-fns patterns:
- `'yyyy-MM-dd'` - 2024-12-23
- `'MMM dd, yyyy'` - Dec 23, 2024
- `'MMMM d, yyyy h:mm a'` - December 23, 2024 2:30 PM

See `date-fns` format patterns: https://date-fns.org/docs/format

## Troubleshooting

**Calendar not showing?**
- Check if `isOpen` state is being set to true
- Verify click-outside handler isn't triggering immediately

**Time inputs not working?**
- Ensure `showTime={true}` is set
- Check that `selectedDate` is not null

**Styling doesn't match InputField?**
- Verify Tailwind classes are applied correctly
- Check that `rounded-2xl`, `px-6 py-4` classes are present

**Form not submitting?**
- Verify `FormDateTimeField` name matches form field definition
- Check validation rules are correct
- Ensure date format matches what your backend expects

## Performance

- Uses React.memo for optimization opportunities
- Event listeners properly cleanup on unmount
- Efficient calendar rendering with Array.from()
- Minimal re-renders due to controlled component pattern

## Future Enhancements

- [ ] Preset date ranges (Today, This Week, This Month, This Year)
- [ ] Time zone support (using date-fns-tz)
- [ ] Keyboard navigation (arrow keys, Enter)
- [ ] Disabled date ranges
- [ ] Time picker validation (end time > start time)
- [ ] Min/Max date constraints
- [ ] Responsive mobile layout improvements

---

**Created:** December 23, 2024
**Last Updated:** December 23, 2024
**Status:** ✅ Ready for integration
