import { orpc } from '@/utils/orpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

// STEP 1: Tạo route file + State management
export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    conditionNotes: '',
    pricePerDay: 0,
    depositAmount: 0,
    estimatedValue: 0,
    minRentalDays: 1,
    maxRentalDays: 30,
    noticeHours: 0,
    pickupMethod: 'IN_PERSON' as const,
    province: '',
    district: '',
    ward: '',
  });

  // STEP 2: Helper function update form
  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  // STEP 3: Fetch categories cho dropdown
  const { data: categoriesData } = useQuery(orpc.listings.categories.queryOptions());
  const categories = categoriesData?.items ?? [];

  const createMutation = useMutation(orpc.listings.create.mutationOptions({
    onSuccess: () => {
      navigate({to: '/dashboard/listings'})
    }
  }));

  // STEP 4: Submit mutation
  function handleSubmit() {
    createMutation.mutate({
      ...form,
      pricePerDay: Number(form.pricePerDay),
      depositAmount: Number(form.depositAmount),
      estimatedValue: Number(form.estimatedValue),
      minRentalDays: Number(form.minRentalDays),
      maxRentalDays: Number(form.maxRentalDays),
      noticeHours: Number(form.noticeHours),
    });
  }

  // STEP 5: Step navigation + Progress bar
  const canGoNext = () => {
    if (step === 1) return form.title.length >= 10 && 
      form.description.length >= 20 && form.categoryId !== '';
    if (step === 2) return form.pricePerDay > 0 && form.estimatedValue > 0;
    if (step === 3) return form.province !== '' && form.district !== '';
    
    return true;
  }

  // JSX — progress bar + navigation:
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Đăng đồ cho thuê</h1>
      <p className="text-muted-foreground mb-6">Bước {step} / {TOTAL_STEPS}</p>
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-8">
        <div
          className="bg-foreground h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      {/* Step content — render theo step hiện tại */}
      {step === 1 && <StepBasicInfo form={form} updateField={updateField} categories={categories} />}
      {step === 2 && <StepPricing form={form} updateField={updateField} />}
      {step === 3 && <StepLocation form={form} updateField={updateField} />}
      {step === 4 && <StepReview form={form} />}
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium disabled:opacity-30 hover:bg-muted transition-colors"
        >
          ← Quay lại
        </button>
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canGoNext()}
            className="px-6 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            Tiếp theo →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="px-6 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            {createMutation.isPending ? <><Spinner variant="inline" /> Đang tạo...</> : 'Đăng đồ'}
          </button>
        )}
      </div>
      {createMutation.isError && (
        <p className="text-red-600 text-sm mt-4">
          Lỗi: {createMutation.error.message}
        </p>
      )}
    </div>
  )
}

// STEP 6: Các Steps components
// STEP 6.1: Thông tin cơ bản
function StepBasicInfo({ form, updateField, categories }: {
  form: any
  updateField: (key: any, value: any) => void
  categories: { id: string; name: string; }[]
}) {
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Tiêu đề <span className="text-red-500">*</span></label>
        <input
          value={form.title}
          onChange={e => updateField('title', e.target.value)}
          placeholder="VD: Canon EOS R5 — Body Only, mới 98%"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground mt-1">{form.title.length}/200 ký tự (tối thiểu 10)</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả <span className="text-red-500">*</span></label>
        <textarea
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Mô tả chi tiết tình trạng, phụ kiện đi kèm, lý do cho thuê..."
          rows={4}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background resize-none"
          maxLength={5000}
        />
        <p className="text-xs text-muted-foreground mt-1">{form.description.length}/5000 (tối thiểu 20)</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Danh mục <span className="text-red-500">*</span></label>
        <select
          value={form.categoryId}
          onChange={e => updateField('categoryId', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
        >
          <option value="">Chọn danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú tình trạng</label>
        <input
          value={form.conditionNotes}
          onChange={e => updateField('conditionNotes', e.target.value)}
          placeholder="VD: Có vết trầy nhỏ ở góc phải"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
        />
      </div>
    </div>
  )
}

// STEP 6.2: Giá & Quy định
function StepPricing({ form, updateField }: { form: any; updateField: (key: any, value: any) => void }) {
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Giá thuê / ngày (VNĐ) <span className="text-red-500">*</span></label>
        <input type="number" value={form.pricePerDay || ''} onChange={e => updateField('pricePerDay', e.target.value)}
          placeholder="50000" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tiền cọc (VNĐ) <span className="text-red-500">*</span></label>
        <input type="number" value={form.depositAmount || ''} onChange={e => updateField('depositAmount', e.target.value)}
          placeholder="200000" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Giá trị ước tính (VNĐ) <span className="text-red-500">*</span></label>
        <input type="number" value={form.estimatedValue || ''} onChange={e => updateField('estimatedValue', e.target.value)}
          placeholder="5000000" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ngày thuê tối thiểu</label>
          <input type="number" value={form.minRentalDays} onChange={e => updateField('minRentalDays', e.target.value)}
            min={1} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày thuê tối đa</label>
          <input type="number" value={form.maxRentalDays} onChange={e => updateField('maxRentalDays', e.target.value)}
            max={90} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Cần báo trước (giờ)</label>
        <input type="number" value={form.noticeHours} onChange={e => updateField('noticeHours', e.target.value)}
          min={0} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hình thức nhận đồ</label>
        <select value={form.pickupMethod} onChange={e => updateField('pickupMethod', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option value="IN_PERSON">Gặp mặt trực tiếp</option>
          <option value="SHIP_AVAILABLE">Giao hàng / Gặp mặt</option>
        </select>
      </div>
    </div>
  )
}

// STEP 6.3: Địa điểm
function StepLocation({ form, updateField }: { form: any; updateField: (key: any, value: any) => void }) {
  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
        <input value={form.province} onChange={e => updateField('province', e.target.value)}
          placeholder="TP. Hồ Chí Minh" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
        <input value={form.district} onChange={e => updateField('district', e.target.value)}
          placeholder="Quận 1" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phường/Xã</label>
        <input value={form.ward} onChange={e => updateField('ward', e.target.value)}
          placeholder="Phường Bến Nghé" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" />
      </div>
    </div>
  )
}

// STEP 6.4: Xác nhận
function StepReview({ form }: { form: any }) {
  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg font-bold">Xác nhận thông tin</h2>
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-sm">
        <Row label="Tiêu đề" value={form.title} />
        <Row label="Mô tả" value={form.description.slice(0, 100) + (form.description.length > 100 ? '...' : '')} />
        <Row label="Giá thuê" value={`${Number(form.pricePerDay).toLocaleString('vi-VN')}đ / ngày`} />
        <Row label="Tiền cọc" value={`${Number(form.depositAmount).toLocaleString('vi-VN')}đ`} />
        <Row label="Giá trị" value={`${Number(form.estimatedValue).toLocaleString('vi-VN')}đ`} />
        <Row label="Số ngày" value={`${form.minRentalDays} — ${form.maxRentalDays} ngày`} />
        <Row label="Địa điểm" value={`${form.district}, ${form.province}`} />
        <Row label="Nhận đồ" value={form.pickupMethod === 'IN_PERSON' ? 'Gặp mặt' : 'Giao hàng / Gặp mặt'} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  )
}
