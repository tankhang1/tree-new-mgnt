export type Animal = {
  id: string;
  tag: string;
  name: string;
  group: string;
  breed: string;
  dob: string;
  parity: number;
  status: "hau-bi" | "dang-sua" | "bo-thit";
  avatar?: string;
};
export const animals: Animal[] = [
  {
    id: "b001",
    tag: "HF-001",
    name: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    breed: "Holstein Friesian",
    dob: "2022-01-10",
    parity: 1,
    status: "dang-sua",
    avatar:
      "https://channuoithuy.com.vn/wp-content/uploads/2023/07/bo-ha-lan-1.jpg",
  },
  {
    id: "b002",
    tag: "HF-012",
    name: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    breed: "Holstein Friesian",
    dob: "2021-09-05",
    parity: 2,
    status: "dang-sua",
    avatar:
      "https://channuoithuy.com.vn/wp-content/uploads/2023/07/bo-ha-lan-1.jpg",
  },
  {
    id: "b003",
    tag: "HB-078",
    name: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    breed: "HF × Sind",
    dob: "2023-03-18",
    parity: 0,
    status: "hau-bi",
    avatar: "https://nhachannuoi.vn/wp-content/uploads/2017/12/bo-hau-bi.jpg",
  },
  {
    id: "b004",
    tag: "MT-045",
    name: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    breed: "Lai Sind",
    dob: "2022-06-02",
    parity: 0,
    status: "bo-thit",
    avatar:
      "https://cuongthinhjsc.vn/wp-content/uploads/2017/07/bo-lai-sind.jpg",
  },
];
