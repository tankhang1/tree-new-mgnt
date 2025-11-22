export type CropType = "corn" | "soybean";

export const CROP_VARIETIES: Record<
  CropType,
  {
    id: string;
    name: string;
    imageUrl: string;
  }[]
> = {
  corn: [
    {
      id: "LVN10",
      name: "Bắp lai LVN10",
      imageUrl:
        "https://storage.vinaseed.com.vn/Data/2020/03/09/1-ngo-lai-don-ssc131-637193725438515586.jpg?w=228&h=185&mode=crop",
    },
    {
      id: "MX2",
      name: "Bắp nếp lai MX2",
      imageUrl:
        "https://storage.vinaseed.com.vn/Data/2020/03/10/2-ngo-nep-lai-hn88-637194769755019939.jpg?w=620&h=350",
    },
    {
      id: "NK7328",
      name: "Bắp lai NK7328",
      imageUrl:
        "https://product.hstatic.net/200000722083/product/73_ff5424d43c15493c82df6e42a2266a84_medium.png",
    },
    {
      id: "PAC999",
      name: "Bắp lai PAC999",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvefa87WkuAmJcRf7e-LDX04LZJEiPGSP-7w&s",
    },
  ],
  soybean: [
    {
      id: "DT84",
      name: "Đậu nành DT84",
      imageUrl: "https://e.khoahoc.tv/photos/image/2015/09/23/dau-tuong.jpg",
    },
    {
      id: "KS95",
      name: "Đậu nành KS95",
      imageUrl:
        "https://bizweb.dktcdn.net/100/237/115/products/dau-2.jpg?v=1696306135027",
    },
    {
      id: "MTD176",
      name: "Đậu nành MTD176",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAj6eFjA3OlH_YQHfAi6wGu-Yc3xpw-o2u2bCVhRd80B3Y-h5al3qdwjrwGurFLQZ26_Y&usqp=CAU",
    },
  ],
};
