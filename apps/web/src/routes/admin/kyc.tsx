import { orpc } from '@/utils/orpc';
import { Spinner } from '@/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/kyc')({
  component: AdminKycPage,
})

function AdminKycPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(orpc.kyc.admin.listPending.queryOptions());

  if (isLoading) return <Spinner variant="page" />

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>KYC Queue</h1>
      <table className='w-full border-collapse border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border p-2 text-left'>Họ tên</th>
            <th className='border p-2 text-left'>Ngày sanh</th>
            <th className='border p-2 text-left'>Ngày nộp</th>
            <th className='border p-2'></th>
          </tr>
        </thead>
        <tbody>
          {data?.map(row => (
            <tr key={row.userId}>
              <td className='border p-2'>{row.fullName}</td>
              <td className='border p-2'>{row.dateOfBirth}</td>
              <td className='border p-2'>{new Date(row.createdAt).toLocaleDateString('vi-VN')}</td>
              <td className='border p-2'>
                <button 
                  className='bg-black text-white px-3 py-1 rounded text-sm'
                  onClick={() => navigate({to: '/admin/kyc/$userId', params: {userId: row.userId}})}>
                    Xem
                </button>
              </td>
            </tr>
          ))}
          {data?.length === 0 && (
            <tr><td colSpan={4} className='text-center p-4 text-gray-500'>Không có yêu cầu nào</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
