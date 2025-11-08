import { useState, useMemo } from "react";
import { Building2, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const owners = [
  {
    id: "1",
    name: "Hộ ông Nguyễn Văn A",
    type: "Hộ nông dân",
    owner: "Nguyễn Văn A",
    phone: "0912345678",
    email: "a.nongdan@example.com",
    address: "Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
  },
  {
    id: "2",
    name: "HTX Nông nghiệp Bền Vững",
    type: "Hợp tác xã",
    owner: "Trần Thị B",
    phone: "0938123456",
    email: "info@benvungcoop.vn",
    address: "Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
  },
  {
    id: "3",
    name: "Hộ ông Lê Văn C",
    type: "Hộ nông dân",
    owner: "Lê Văn C",
    phone: "0987654321",
    email: "c.nongdan@example.com",
    address: "Ấp 2, xã Tân Hưng, huyện Đồng Phú, Bình Phước",
  },
  {
    id: "4",
    name: "HTX Nông nghiệp Xanh",
    type: "Hợp tác xã",
    owner: "Nguyễn Thị D",
    phone: "0901234567",
    email: "info@nôngnghiepxanh.vn",
    address: "Xã Tân Tiến, huyện Đồng Xoài, Bình Phước",
  },
  {
    id: "5",
    name: "Doanh nghiệp VinaCorn",
    type: "Doanh nghiệp",
    owner: "Phạm Văn E",
    phone: "0977888999",
    email: "contact@vinacorn.vn",
    address: "KCN An Bình, Huyện Dầu Tiếng, Bình Dương",
  },
];

export default function OwnerSelectCard() {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Lọc danh sách theo từ khoá
  const filteredOwners = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return owners;
    return owners.filter(
      (o) =>
        o.name.toLowerCase().includes(keyword) ||
        o.owner.toLowerCase().includes(keyword) ||
        o.type.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-1">
        Doanh nghiệp / Hợp tác xã / Hộ nông dân *
      </p>

      {/* Ô tìm kiếm */}
      <div className="relative">
        <Input
          placeholder="Tìm kiếm theo tên, loại hình hoặc chủ sở hữu..."
          className="h-9 pl-8 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Danh sách thẻ */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filteredOwners.length > 0 ? (
          filteredOwners.map((item) => {
            const isSelected = selectedOwner === item.id;
            return (
              <Card
                key={item.id}
                onClick={() => setSelectedOwner(item.id)}
                className={cn(
                  "cursor-pointer border transition-all p-3 hover:shadow-sm",
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 bg-primary/5"
                    : "hover:border-primary/60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      {item.type === "Hợp tác xã" ? (
                        <Building2 className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-green-600" />
                      )}
                      {item.name}
                    </div>
                    <p
                      className={cn(
                        "text-[11px] font-medium",
                        item.type === "Hợp tác xã"
                          ? "text-primary"
                          : item.type === "Doanh nghiệp"
                          ? "text-blue-600"
                          : "text-green-600"
                      )}
                    >
                      {item.type}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="text-primary text-xs font-semibold">✓</div>
                  )}
                </div>

                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <p>
                    <span className="font-semibold text-foreground">
                      Chủ sở hữu:
                    </span>{" "}
                    {item.owner}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">SĐT:</span>{" "}
                    {item.phone}
                  </p>
                  <p className="truncate">
                    <span className="font-semibold text-foreground">
                      Email:
                    </span>{" "}
                    {item.email}
                  </p>
                  <p className="line-clamp-2">
                    <span className="font-semibold text-foreground">
                      Địa chỉ:
                    </span>{" "}
                    {item.address}
                  </p>
                </div>
              </Card>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground italic col-span-full text-center py-6">
            Không tìm thấy kết quả phù hợp.
          </p>
        )}
      </div>

      {selectedOwner && (
        <div className="text-xs text-muted-foreground mt-2">
          <span className="font-medium text-foreground">Đã chọn:</span>{" "}
          {owners.find((o) => o.id === selectedOwner)?.name}
        </div>
      )}
    </div>
  );
}
