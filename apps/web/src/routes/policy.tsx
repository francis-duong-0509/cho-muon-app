import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";

export const Route = createFileRoute("/policy")({ component: PolicyPage });

const POLICY_SECTIONS = [
  {
    id: "terms",
    title: "Điều Khoản Dịch Vụ",
    content: `Bằng cách sử dụng nền tảng ChoMuon, bạn đồng ý tuân thủ các điều khoản dưới đây. Người dùng phải đủ 18 tuổi trở lên và cung cấp thông tin cá nhân chính xác khi đăng ký tài khoản. ChoMuon đóng vai trò trung gian kết nối người cho thuê và người thuê, không chịu trách nhiệm trực tiếp về chất lượng vật phẩm được đăng tải. Mọi giao dịch thực hiện qua nền tảng phải tuân thủ pháp luật hiện hành của Việt Nam, bao gồm các quy định về thương mại điện tử. ChoMuon có quyền tạm khóa hoặc xóa tài khoản vi phạm điều khoản mà không cần thông báo trước.`,
  },
  {
    id: "privacy",
    title: "Chính Sách Bảo Mật",
    content: `ChoMuon thu thập dữ liệu cá nhân như họ tên, số điện thoại, email và địa chỉ nhằm mục đích xác minh danh tính và hỗ trợ giao dịch. Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng và phân tích hành vi sử dụng dịch vụ, người dùng có thể tắt cookies qua cài đặt trình duyệt. Dữ liệu của bạn không bao giờ được bán cho bên thứ ba vì mục đích thương mại; chỉ chia sẻ khi có yêu cầu pháp lý hoặc để cung cấp dịch vụ. Chúng tôi áp dụng mã hóa SSL/TLS cho mọi kết nối và lưu trữ dữ liệu trên máy chủ đặt tại Việt Nam theo tiêu chuẩn bảo mật ISO 27001. Người dùng có quyền yêu cầu xem, sửa đổi hoặc xóa dữ liệu cá nhân bằng cách liên hệ qua email privacy@chomuon.vn.`,
  },
  {
    id: "deposit",
    title: "Chính Sách Đặt Cọc",
    content: `Khoản đặt cọc được tính dựa trên giá trị ước tính của vật phẩm và do chủ đồ quy định, thường dao động từ 10% đến 50% giá trị thực tế. Đặt cọc được giữ lại bởi hệ thống ChoMuon cho đến khi người thuê hoàn trả vật phẩm đúng tình trạng ban đầu. Hoàn trả đặt cọc đầy đủ trong vòng 24 giờ sau khi chủ đồ xác nhận nhận lại hàng nguyên vẹn; trường hợp vật phẩm bị hư hỏng, khoản khấu trừ sẽ được thương lượng hai bên. Trong trường hợp tranh chấp về hư hỏng, ChoMuon sẽ làm trung gian dựa trên bằng chứng ảnh chụp trước và sau thuê do cả hai bên cung cấp. Phí xử lý giao dịch hoàn trả đặt cọc là 1% giá trị, tối thiểu 5.000đ và tối đa 50.000đ.`,
  },
  {
    id: "rental-rules",
    title: "Quy Định Cho Thuê",
    content: `Người cho thuê phải đảm bảo vật phẩm đăng tải đúng mô tả, ảnh chụp thực tế và tình trạng hiện tại; gian lận mô tả sẽ bị xử phạt và tạm khóa tài khoản. Chính sách hủy đặt lịch: hủy trước 48 giờ được hoàn 100% tiền đặt cọc; hủy trong vòng 24-48 giờ hoàn 50%; hủy trong vòng 24 giờ không hoàn tiền, trừ lý do khẩn cấp có xác nhận. Người thuê chịu hoàn toàn trách nhiệm về vật phẩm trong thời gian thuê, bao gồm mất mát, hư hỏng do sử dụng sai mục đích hoặc tai nạn. Xử lý hư hỏng: hư hỏng nhẹ (dưới 200.000đ) hai bên tự thỏa thuận; hư hỏng nặng hơn cần lập biên bản và gửi về ChoMuon trong vòng 2 giờ sau khi phát hiện. Người cho thuê không được liên tục từ chối đơn thuê hợp lệ; hệ thống sẽ cảnh báo nếu tỷ lệ từ chối vượt quá 30%.`,
  },
  {
    id: "disputes",
    title: "Giải Quyết Tranh Chấp",
    content: `Để báo cáo tranh chấp, người dùng truy cập mục "Hỗ trợ" trong tài khoản và chọn "Báo cáo vấn đề", kèm theo ảnh, video bằng chứng và mô tả chi tiết. Thời gian xử lý tranh chấp thông thường là 3-5 ngày làm việc; trường hợp phức tạp có thể kéo dài đến 10 ngày làm việc. ChoMuon sẽ liên hệ cả hai bên để thu thập thông tin và đưa ra phán quyết dựa trên bằng chứng khách quan; phán quyết của ChoMuon là quyết định cuối cùng trong phạm vi nền tảng. Bồi thường tối đa trong một tranh chấp không vượt quá giá trị đặt cọc ban đầu; trường hợp thiệt hại lớn hơn, các bên có thể khởi kiện theo pháp luật dân sự. ChoMuon áp dụng chính sách "người dùng được bảo vệ" cho lần tranh chấp đầu tiên, với khoản bồi thường tối đa 500.000đ từ quỹ bảo đảm của nền tảng.`,
  },
];

function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNavbarWithAuthCta />

      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Chính Sách & Điều Khoản
          </h1>
          <p className="text-muted-foreground text-sm">
            Cập nhật lần cuối: 17 tháng 3, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-4">
        {POLICY_SECTIONS.map((section) => (
          <details
            key={section.id}
            className="bg-white border border-border rounded-xl overflow-hidden group"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-foreground">{section.title}</span>
              <span className="text-primary transition-transform group-open:rotate-90 text-lg font-bold shrink-0 ml-4">
                ›
              </span>
            </summary>
            <div className="px-6 pb-6 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          </details>
        ))}
      </div>

      <SiteFooterWithNavLinks />
    </div>
  );
}
