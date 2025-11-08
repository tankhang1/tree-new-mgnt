import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function MilestoneTimeline({ filteredLogs }: { filteredLogs: any[] }) {
  // Gom nhóm theo ngày
  const grouped = filteredLogs.reduce((acc: any, log: any) => {
    const date = new Date(log.date).toLocaleDateString("vi-VN");
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) =>
      new Date(b.split("/").reverse().join("-")).getTime() -
      new Date(a.split("/").reverse().join("-")).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Nhật ký chăn nuôi theo ngày
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedDates.length === 0 ? (
          <div className="flex items-center justify-center rounded-md border border-dashed bg-muted/30 px-4 py-10 text-xs text-muted-foreground">
            Chưa có nhật ký nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          sortedDates.map((date, dayIndex) => (
            <div key={date} className="relative">
              {/* Header ngày */}
              <div className="sticky top-0 z-10 flex items-center gap-2 bg-background py-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {dayIndex + 1}
                </div>
                <h3 className="text-sm font-semibold text-primary">{date}</h3>
                <Separator className="flex-1 ml-2 bg-border" />
              </div>

              {/* Các mốc trong ngày */}
              <div className="mt-3 space-y-3">
                {grouped[date].map((log: any, idx: number) => (
                  <div
                    key={log.id ?? idx}
                    className="ml-6 border-l border-border pl-4 relative"
                  >
                    {/* chấm tròn */}
                    <div className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-primary" />
                    <div className="rounded-lg border bg-card p-3 shadow-sm text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">
                            {log.animalName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Thẻ tai: {log.animalTag ?? "-"} • Chuồng:{" "}
                            {log.barn ?? "-"}
                          </p>
                        </div>
                        {renderHealthBadge(log.healthStatus)}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {log.weight && (
                          <MetricPill
                            label="Khối lượng"
                            value={`${log.weight} kg`}
                          />
                        )}
                        {log.milkYield && (
                          <MetricPill
                            label="Sản lượng sữa"
                            value={`${log.milkYield} lít`}
                          />
                        )}
                        {log.feedIntake && (
                          <MetricPill
                            label="Thức ăn"
                            value={`${log.feedIntake} kg`}
                          />
                        )}
                        {log.temperature && (
                          <MetricPill
                            label="Nhiệt độ"
                            value={`${log.temperature} °C`}
                          />
                        )}
                      </div>

                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground">
                            Ghi chú
                          </p>
                          <p className="rounded-md bg-muted/40 p-2 text-[11px]">
                            {log.note || "Không có ghi chú."}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground">
                            Nguyên nhân
                          </p>
                          <p className="rounded-md bg-muted/40 p-2 text-[11px]">
                            {log.reason || log.analysis || "Không xác định."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                        <span>
                          Người ghi:{" "}
                          <span className="font-medium text-foreground">
                            {log.recordedBy || "-"}
                          </span>
                        </span>
                        {log.timeOfDay && (
                          <span>
                            Thời gian:{" "}
                            <span className="font-medium text-foreground">
                              {log.timeOfDay}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// ===== Helper components =====
function renderHealthBadge(status: string | undefined) {
  if (!status)
    return (
      <Badge variant="outline" className="text-[10px]">
        Chưa đánh giá
      </Badge>
    );
  if (status === "tot")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Tốt</Badge>
    );
  if (status === "can-theo-doi")
    return (
      <Badge className="bg-amber-100 text-amber-700 text-[10px]">
        Theo dõi
      </Badge>
    );
  if (status === "can-xu-ly")
    return (
      <Badge className="bg-red-100 text-red-700 text-[10px]">Cần xử lý</Badge>
    );
  return (
    <Badge variant="outline" className="text-[10px]">
      {status}
    </Badge>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default MilestoneTimeline;
