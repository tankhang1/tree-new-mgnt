export type CultivationMethod = "mono" | "intercrop" | "border";

export const CULTIVATION_METHODS: {
  id: CultivationMethod;
  label: string;
  description: string;
  maxVarieties: number;
  maxSeeds: number;
}[] = [
  {
    id: "mono",
    label: "Độc canh một giống",
    description: "Một giống cây chính trên toàn bộ lô.",
    maxVarieties: 1,
    maxSeeds: 1,
  },
  {
    id: "intercrop",
    label: "Luân canh / xen canh",
    description: "Tối đa 2 giống trên cùng lô hoặc theo hàng.",
    maxVarieties: 2,
    maxSeeds: 2,
  },
  {
    id: "border",
    label: "Giống viền lô",
    description: "Giống chính ở giữa, giống khác trồng viền lô.",
    maxVarieties: 2,
    maxSeeds: 2,
  },
];
