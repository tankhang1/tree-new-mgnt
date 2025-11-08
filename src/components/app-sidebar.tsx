"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  SquareTerminal,
  Bot,
  Settings2,
  Frame,
  PieChart,
  Map,
  ShieldAlert,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Quản trị viên trang trại",
    email: "admin@agri.vn",
    avatar: "/avatars/farm-admin.jpg",
  },
  teams: [
    {
      name: "Trang trại bò sữa Long Thành",
      logo: GalleryVerticalEnd,
      plan: "Quản lý chăn nuôi",
    },
    {
      name: "Nông trại cây ăn trái Miền Tây",
      logo: AudioWaveform,
      plan: "Quản lý canh tác",
    },
    {
      name: "Vùng sản xuất thức ăn chăn nuôi Bình Dương",
      logo: Command,
      plan: "Sản xuất & cung ứng nội bộ",
    },
  ],
  navMain: [
    {
      title: "Tài chính - Kế toán",
      url: "finance",
      icon: PieChart,
      isActive: true,
      items: [
        { title: "Công nợ phải trả (NCC)", url: "finance/payables" },
        { title: "Công nợ phải thu (KH)", url: "finance/receivables" },
        { title: "Chứng từ chi tiền", url: "finance/payments" },
        { title: "Chứng từ thu tiền", url: "finance/collections" },
        { title: "Báo cáo công nợ tổng hợp", url: "finance/debts-report" },
      ],
    },
    {
      title: "Vật tư & Mua hàng",
      url: "materials",
      icon: SquareTerminal,
      items: [
        { title: "Vật tư nông nghiệp", url: "materials/supplies" },
        { title: "Đơn mua vật tư nông nghiệp", url: "materials/orders" },
        {
          title: "Phân bón, thuốc BVTV",
          url: "materials/agri-inputs",
        },
        { title: "Hóa đơn & chứng từ nhập hàng", url: "materials/invoices" },
        { title: "Nhà cung cấp", url: "materials/suppliers" },
      ],
    },
    {
      title: "Sản xuất - Chăn nuôi",
      url: "livestock",
      icon: AudioWaveform,
      items: [
        { title: "Kế hoạch nuôi & phối giống", url: "livestock/plans" },
        { title: "Theo dõi tăng trưởng & sức khỏe", url: "livestock/health" },
        { title: "Nhật ký chăn nuôi", url: "livestock/visit-logs" },
        { title: "Báo cáo sản lượng & chi phí", url: "livestock/reports" },
      ],
    },
    {
      title: "Canh tác - Trồng trọt",
      url: "crop",
      icon: Map,
      items: [
        { title: "Danh mục vườn cây & lô đất", url: "crop/fields" },
        { title: "Danh sách cây trồng", url: "crop/plants" },
        { title: "Nhóm cây trồng", url: "crop/plans" },
        { title: "Nhật ký canh tác", url: "crop/logs" },
        { title: "Báo cáo năng suất & chất lượng", url: "crop/reports" },
      ],
    },
    // {
    //   title: "Kho & Vận hành",
    //   url: "warehouse",
    //   icon: Frame,
    //   items: [
    //     { title: "Quản lý tồn kho vật tư", url: "warehouse/material-stock" },
    //     { title: "Kho thành phẩm & nông sản", url: "warehouse/finished-goods" },
    //     { title: "Kiểm kê & cảnh báo tồn kho", url: "warehouse/stock-control" },
    //     { title: "Vận chuyển nội bộ", url: "warehouse/transfer" },
    //   ],
    // },
    // {
    //   title: "Sản xuất thức ăn chăn nuôi",
    //   url: "feed-production",
    //   icon: Bot,
    //   items: [
    //     { title: "Kế hoạch phối trộn", url: "feed-production/formulas" },
    //     { title: "Nguyên liệu đầu vào", url: "feed-production/materials" },
    //     { title: "Theo dõi sản xuất", url: "feed-production/tracking" },
    //   ],
    // },
    {
      title: "Phân tích & Báo cáo",
      url: "analytics",
      icon: Settings2,
      items: [
        { title: "Hiệu quả sản xuất", url: "analytics/production-efficiency" },
        { title: "Chi phí & lợi nhuận", url: "analytics/profitability" },
        {
          title: "Báo cáo môi trường & carbon",
          url: "analytics/sustainability",
        },
      ],
    },
    {
      title: "Phác đồ điều trị",
      url: "treatment",
      icon: ShieldAlert,
      items: [
        {
          title: "Cây trồng",
          url: "treatment/plants",
        },
        { title: "Động vật / Gia súc", url: "treatment/animals" },
      ],
    },
    // {
    //   title: "Hệ thống & Tích hợp",
    //   url: "system",
    //   icon: Command,
    //   items: [
    //     {
    //       title: "Liên kết kho - tài chính - sản xuất",
    //       url: "system/integration",
    //     },
    //     { title: "Quản lý người dùng & phân quyền", url: "system/users" },
    //     { title: "Cấu hình quy trình ERP", url: "system/workflows" },
    //   ],
    // },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
