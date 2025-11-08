import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation, Link } from "react-router";

export default function MainPage() {
  const location = useLocation();

  const titleMap: Record<string, string> = {
    // --- Tài chính - Kế toán ---
    finance: "Tài chính - Kế toán",
    payables: "Công nợ phải trả (Nhà cung cấp)",
    receivables: "Công nợ phải thu (Khách hàng)",
    payments: "Chứng từ chi tiền",
    collections: "Chứng từ thu tiền",
    "debts-report": "Báo cáo công nợ tổng hợp",

    // --- Vật tư & Mua hàng ---
    materials: "Vật tư & Mua hàng",
    orders: "Đơn mua vật tư nông nghiệp",
    "agri-inputs": "Phân bón & thuốc BVTV",
    invoices: "Hóa đơn & chứng từ nhập hàng",
    suppliers: "Nhà cung cấp",

    // --- Sản xuất - Chăn nuôi ---
    livestock: "Sản xuất - Chăn nuôi",
    plans: "Kế hoạch",
    health: "Theo dõi tăng trưởng & sức khỏe",
    logs: "Nhật ký chăn nuôi",
    reports: "Báo cáo sản lượng & chi phí",

    // --- Canh tác - Trồng trọt ---
    crop: "Canh tác - Trồng trọt",
    fields: "Danh mục vườn cây & lô đất",
    "crop/plans": "Kế hoạch gieo trồng & chăm sóc",
    "crop/logs": "Nhật ký canh tác",
    "crop/reports": "Báo cáo năng suất & chất lượng",

    // --- Kho & Vận hành ---
    warehouse: "Kho & Vận hành",
    "material-stock": "Tồn kho vật tư",
    "finished-goods": "Kho thành phẩm & nông sản",
    "stock-control": "Kiểm kê & cảnh báo tồn kho",
    transfer: "Vận chuyển nội bộ",

    // --- Sản xuất thức ăn chăn nuôi ---
    "feed-production": "Sản xuất thức ăn chăn nuôi",
    formulas: "Kế hoạch phối trộn",
    "feed-production/materials": "Nguyên liệu đầu vào",
    tracking: "Theo dõi sản xuất",

    // --- Phân tích & Báo cáo ---
    analytics: "Phân tích & Báo cáo",
    "production-efficiency": "Hiệu quả sản xuất",
    profitability: "Chi phí & lợi nhuận",
    sustainability: "Báo cáo môi trường & carbon",

    // --- Hệ thống & Tích hợp ---
    system: "Hệ thống & Tích hợp",
    integration: "Liên kết kho - tài chính - sản xuất",
    users: "Quản lý người dùng & phân quyền",
    workflows: "Cấu hình quy trình ERP",

    // --- Dự án chuỗi ---
    projects: "Chuỗi giá trị nông nghiệp",
    "input-supply": "Chuỗi cung ứng vật tư đầu vào",
    "livestock-chain": "Chuỗi sản xuất & chăn nuôi hợp nhất",
    "crop-chain": "Chuỗi canh tác & chế biến nông sản",
    add: "Thêm mới",
    schedule: "Kế hoạch",
    treatment: "Phát đồ điều trị",
    animals: "Động vật",
    plants: "Cây trồng",
    "plant-variety": "Giống cây trồng",
  };

  // ✅ Lấy ra các phần của URL
  const segments = location.pathname
    .replace(/^\/main\/?/, "") // loại bỏ /main/
    .split("/")
    .filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          {/* ✅ Breadcrumb tự động + tiếng Việt */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/main">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {segments.map((segment, index) => {
                const path = `/main/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const title = titleMap[segment] ?? segment;

                return (
                  <React.Fragment key={path}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={path}>{title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Nội dung */}
        <div className="flex flex-1 flex-col px-6 pt-4 pt-2">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
