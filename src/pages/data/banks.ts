export type BankAccount = {
  id: string;
  name: string;
  owner: string;
  account: string;
  branch: string;
  note?: string;
  avatar: string;
};
export const bankAccounts: BankAccount[] = [
  {
    id: "b1",
    name: "Techcombank (TCB)",
    owner: "Công ty ABC",
    account: "19001234567890",
    branch: "CN Sài Gòn",
    note: "Tài khoản giao dịch chính",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Techcombank_logo.png",
  },
  {
    id: "b2",
    name: "Vietcombank (VCB)",
    owner: "Công ty ABC",
    account: "0011001234567",
    branch: "CN Hà Nội",
    note: "Dùng cho thanh toán nội bộ",
    avatar:
      "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-Vietcombank.png",
  },
];
