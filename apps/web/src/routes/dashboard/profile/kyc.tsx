import { client, orpc } from '@/utils/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/profile/kyc')({
  component: KycPage,
})

interface UploadFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFiles: React.Dispatch<React.SetStateAction<{ front?: File; back?: File; selfie?: File }>>;
  isPending: boolean;
}

function UploadForm({ onSubmit, setFiles, isPending }: UploadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">CCCD Mặt trước</label>
        <input type="file" accept="image/*" onChange={e => setFiles(f => ({...f, front: e.target.files?.[0]}))} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">CCCD Mặt sau</label>
        <input type="file" accept="image/*" onChange={e => setFiles(f => ({...f, back: e.target.files?.[0]}))} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ảnh selfie</label>
        <input type="file" accept="image/*" onChange={e => setFiles(f => ({...f, selfie: e.target.files?.[0]}))} />
      </div>
      <input name="fullName" placeholder="Họ và tên" className="border rounded px-3 py-2 w-full" required />
      <input name="dateOfBirth" type="date" className="border rounded px-3 py-2 w-full" required />
      <input name="cccdNumber" placeholder="Số CCCD" className="border rounded px-3 py-2 w-full" required />
      <button type="submit" disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded w-full">
        {isPending ? "Đang gửi..." : "Gửi hồ sơ"}
      </button>
    </form>
  );
}

function KycPage() {
  const {data, isLoading} = useQuery(orpc.kyc.getStatus.queryOptions());

  const [files, setFiles] = useState<{
    front?: File;
    back?: File;
    selfie?: File;
  }>({});

  const queryClient = useQueryClient();

  const submitMutation = useMutation(orpc.kyc.submit.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(orpc.kyc.getStatus.queryOptions());
    }
  }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // S1: Get presigned URLs
    const urls = await client.kyc.getUploadUrls();

    // S2: PUT files directly to S3
    const [r1, r2, r3] = await Promise.all([
      fetch(urls.front,  { method: "PUT", body: files.front }),
      fetch(urls.back,   { method: "PUT", body: files.back }),
      fetch(urls.selfie, { method: "PUT", body: files.selfie }),
    ]);

    if (!r1.ok || !r2.ok || !r3.ok) {
      alert(`Upload ảnh thất bại. Vui lòng thử lại.`);
      return;
    }

    // S3: Submit metadata
    const formData = new FormData(form);
    submitMutation.mutate({
      fullName: formData.get("fullName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      cccdNumber: formData.get("cccdNumber") as string,
    });
  }

  if (isLoading) return <div>Đang tải...</div>;

  const status = data?.status ?? "NOT_SUBMITTED";

  if (status === "APPROVED") {
    return (
      <div>
        <h1 className='text-2xl font-bold mb-2'>Xác minh danh tính</h1>
        <p className='text-green-600'>✅ Tài khoản của bạn đã được xác minh</p>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div>
        <h1 className='text-2xl font-bold mb-2'>Xác minh danh tính</h1>
        <p className='text-yellow-600'>⏳ Hồ sơ đang chờ được xác minh</p>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div>
        <h1 className='text-2xl font-bold mb-2'>Xác minh danh tính</h1>
        <p className='text-red-600'>❌ Hồ sơ bị từ chối: {data?.rejectionReason}</p>
        <p className='mt-2 text-sm text-gray-500'>Bạn có thể nộp lại hồ sơ mới</p>
        <UploadForm onSubmit={handleSubmit} setFiles={setFiles} isPending={submitMutation.isPending} />
      </div>
    );
  }

  // NOT_SUBMITTED
  return (
    <div>
      <h1 className='text-2xl font-bold mb-2'>Xác minh danh tính</h1>
      <p className='text-gray-500 mb-4'>Bạn cần xác minh danh tính để sử dụng các tính năng của nền tảng</p>
      <UploadForm onSubmit={handleSubmit} setFiles={setFiles} isPending={submitMutation.isPending} />
    </div>
  );
}