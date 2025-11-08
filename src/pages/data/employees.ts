export type Person = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  org?: string;
};
export const people: Person[] = [
  {
    id: "u1",
    name: "Nguyễn Văn A",
    phone: "0909123456",
    email: "nguyenvana@gmail.com",
    role: "Quản lý trang trại",
    org: "HTX Sầu riêng A1",
  },
  {
    id: "u2",
    name: "Trần Thị B",
    phone: "0934567890",
    email: "tranthib@yahoo.com",
    role: "Kỹ sư nông nghiệp",
    org: "Công ty CP Giống cây trồng XYZ",
  },
  {
    id: "u3",
    name: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@farm.vn",
    role: "Chuyên viên tài chính",
    org: "Nông trại Cửu Long",
  },
  {
    id: "u4",
    name: "Võ Quốc E",
    phone: "0903344556",
    role: "Kỹ thuật viên tưới tiêu",
    org: "AgriCare",
  },
];
