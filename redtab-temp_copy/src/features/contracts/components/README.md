# Contract Components

Các component được bóc tách từ `ContractListView` để tái sử dụng.

## Components

### 1. StatusFilterBar
Component hiển thị các nút lọc theo trạng thái hợp đồng.

**Props:**
- `statusFilter: string` - Trạng thái hiện tại được chọn
- `onStatusChange: (status: string) => void` - Callback khi thay đổi trạng thái

**Sử dụng:**
```tsx
import { StatusFilterBar } from '../components/contracts';

<StatusFilterBar 
  statusFilter={statusFilter} 
  onStatusChange={setStatusFilter} 
/>
```

### 2. StatsCard
Component hiển thị thẻ thống kê.

**Props:**
- `title: string` - Tiêu đề thẻ
- `value: string` - Giá trị hiển thị
- `type: 'recovery' | 'book-value'` - Loại thẻ
- `currencySymbol?: string` - Ký hiệu tiền tệ (mặc định: '$')

**Sử dụng:**
```tsx
import { StatsCard } from '../components/contracts';

// Thống kê tỷ lệ phục hồi
<StatsCard 
  title="Segment Recovery" 
  value="94.2%" 
  type="recovery"
/>

// Thống kê giá trị sổ sách
<StatsCard 
  title="Total Book Value" 
  value="125.5k"
  type="book-value"
  currencySymbol="$"
/>
```

### 3. ContractTable
Component hiển thị bảng hợp đồng.

**Props:**
- `contracts: Contract[]` - Danh sách hợp đồng
- `merchants: Merchant[]` - Danh sách merchant
- `currencySymbol: string` - Ký hiệu tiền tệ

**Sử dụng:**
```tsx
import { ContractTable } from '../components/contracts';

<ContractTable 
  contracts={filteredContracts}
  merchants={merchants}
  currencySymbol={currencySymbol}
/>
```

### 4. ContractFilters
Component hiển thị bộ lọc tìm kiếm và trạng thái.

**Props:**
- `searchTerm: string` - Từ khóa tìm kiếm
- `onSearchChange: (value: string) => void` - Callback khi thay đổi tìm kiếm
- `statusFilter: string` - Trạng thái được chọn
- `onStatusFilterChange: (value: string) => void` - Callback khi thay đổi trạng thái
- `placeholder?: string` - Placeholder cho input tìm kiếm

**Sử dụng:**
```tsx
import { ContractFilters } from '../components/contracts';

<ContractFilters 
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  placeholder="Search segment agreements..."
/>
```

## Export

Tất cả components được export qua `index.ts`:
```tsx
export { StatusFilterBar } from './StatusFilterBar';
export { StatsCard } from './StatsCard';
export { ContractTable } from './ContractTable';
export { ContractFilters } from './ContractFilters';
```

## Sử dụng trong ContractListView

```tsx
import { ContractFilters, StatsCard, ContractTable } from '../components/contracts';

const ContractListView: React.FC = () => {
  // ... logic
  
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <FileStack className="text-redtab" size={28} /> 
          {currentMarketSegment || 'Global Contract Ledger'} Agreements
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Segment Recovery" 
          value="94.2%" 
          type="recovery"
        />
        <StatsCard 
          title="Total Book Value" 
          value={`${(totalDisbursed / 1000).toFixed(1)}k`}
          type="book-value"
          currencySymbol={currencySymbol}
        />
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ContractFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <ContractTable 
          contracts={filteredContracts}
          merchants={merchants}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
};
```

## Benefits

1. **Tái sử dụng**: Các component có thể được sử dụng trong các view khác
2. **Dễ bảo trì**: Mỗi component có trách nhiệm rõ ràng
3. **Kiểm tra dễ dàng**: Component nhỏ hơn dễ unit test hơn
4. **Flexibility**: Props cho phép tùy chỉnh dễ dàng