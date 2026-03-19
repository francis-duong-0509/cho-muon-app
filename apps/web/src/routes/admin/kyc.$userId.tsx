import { orpc } from '@/utils/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/admin/kyc/$userId')({
  component: AdminKycDetailPage,
})

function AdminKycDetailPage() {
  const { userId } = Route.useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [showRejectInput, setShowRejectInput] = useState(false);

  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useQuery(orpc.kyc.admin.getDetail.queryOptions({input: {userId}}));

  const approveMutation = useMutation(orpc.kyc.admin.approve.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(orpc.kyc.admin.listPending.queryOptions());
      navigate({to: '/admin/kyc'});
    }
  }));

  const rejectMutation = useMutation(orpc.kyc.admin.reject.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(orpc.kyc.admin.listPending.queryOptions());
      navigate({to: '/admin/kyc'});
    }
  }));

  if (isLoading) return <div>Đang tải...</div>
  if (!data) return <div>Không tìm thấy hồ sơ</div>

  return (
    <div className='max-w-2xl'>
      <button className='text-sm text-gray-500 mb-4' onClick={() => navigate({to: '/admin/kyc'})}>
        ← Quay lại
      </button>
      <h1 className='text-2xl font-bold mb-4'>KYC: {data.fullName}</h1>
      <div className='space-y-2 mb-6 text-sm'>
        <p><span className='font-medium'>Ngày sanh:</span> {data.dateOfBirth}</p>
        <p><span className='font-medium'>Trạng thái:</span> {data.kycStatus}</p>
      </div>

      <div className='grid grid-cols-3 gap-3 mb-6'>
        <div>
          <p className='text-xs text-gray-500 mb-1'>CCCD Mặt trước: </p>
          <img src={data.cccdFrontUrl} alt="CCCD Mặt trước" className='w-full rounded border' />
        </div>
        <div>
          <p className='text-xs text-gray-500 mb-1'>CCCD Mặt sau: </p>
          <img src={data.cccdBackUrl} alt="CCCD Mặt sau" className='w-full rounded border' />
        </div>
        <div>
          <p className='text-xs text-gray-500 mb-1'>Selfie: </p>
          <img src={data.selfieUrl} alt="Selfie" className='w-full rounded border' />
        </div>
      </div>

      {data.kycStatus === "PENDING" && (
        <div className='flex gap-3'>
          <button
            onClick={() => approveMutation.mutate({ userId })}
            disabled={approveMutation.isPending}
            className='bg-green-600 text-white px-4 py-2 rounded'
          >
            {approveMutation.isPending ? 'Đang xử lý...' : '✅ Duyệt'}
          </button>

          {!showRejectInput ? (
            <button 
              onClick={() => setShowRejectInput(true)}
              className='bg-red-600 text-white px-4 py-2 rounded'>
                ❌ Từ chối
            </button>
          ) : (
            <div className='flex gap-2'>
              <input 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder='Lý do từ chối (tối thiểu 10 ký tự)'
                className='border rounded px-3 py-2 w-64' />

              <button
                disabled={rejectReason.length < 10 || rejectMutation.isPending}
                onClick={() => rejectMutation.mutate({userId, reason: rejectReason})}
                className='bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50'
              >
                Xác nhận
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
