type Certificate = {
  id: string;
  name: string;
  code: string;
  org: string;
  crop: string;
};
export const certificates: Certificate[] = [
  {
    id: "cert-vietgap-001",
    name: "Giấy chứng nhận VietGAP vùng bắp An Giang",
    code: "VG-AG-001",
    org: "Trung tâm Chứng nhận Nông nghiệp",
    crop: "Bắp lai",
  },
  {
    id: "cert-globalgap-002",
    name: "Giấy chứng nhận GlobalG.A.P bắp – đậu nành",
    code: "GG-AG-002",
    org: "Tổ chức GlobalG.A.P",
    crop: "Bắp, Đậu nành",
  },
  {
    id: "cert-organic-003",
    name: "Giấy chứng nhận hữu cơ",
    code: "OR-AG-003",
    org: "Tổ chức chứng nhận hữu cơ",
    crop: "Đậu nành",
  },
];
