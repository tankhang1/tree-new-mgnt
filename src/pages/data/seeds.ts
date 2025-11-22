import type { CropType } from "./crop-varietity";

export type SeedDistribution = "plot" | "row";

export const SEEDS: {
  id: string;
  name: string;
  crop: CropType;
  imageUrl: string;
}[] = [
  {
    id: "seed-lvn10-01",
    name: "Hạt giống LVN10 – Lô 01",
    crop: "corn",
    imageUrl:
      "https://storage.vinaseed.com.vn/Data/2020/02/14/ngo-lai-don-lvn10-700-3-637172784104183900.jpg?w=620&h=350",
  },
  {
    id: "seed-mx2-01",
    name: "Hạt giống MX2 – Lô 01",
    crop: "corn",
    imageUrl:
      "https://vietaseeds.com/wp-content/uploads/2019/11/sup-lo-trang-F1-Va1502-300x300.jpg",
  },
  {
    id: "seed-dt84-01",
    name: "Hạt giống DT84 – Lô 01",
    crop: "soybean",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCi2Yqz3f3-G8pLf4uSo00P7pj4f5PLV1oZA&s",
  },
  {
    id: "seed-mix-corn-soy",
    name: "Mix bắp LVN10 + đậu DT84",
    crop: "corn",
    imageUrl:
      "https://product.hstatic.net/200000563169/product/lvn10_w_9d93ac16510d42ec9ac636937fb6817b_master.png",
  },
];
