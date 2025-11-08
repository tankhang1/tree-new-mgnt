"use client";

import { type LivestockLog } from "./VisitLogs"; // hoặc import type đúng đường dẫn nếu bạn tách type ra riêng
import {
  CalendarDays,
  PawPrint,
  Stethoscope,
  Wheat,
  Droplets,
  Sparkles,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  filteredLogs: LivestockLog[];
};

export default function MilestoneTimeline({ filteredLogs }: Props) {
  // Group theo ngày (YYYY-MM-DD)
  const groupedByDate = filteredLogs.reduce<Record<string, LivestockLog[]>>(
    (acc, log) => {
      if (!acc[log.date]) acc[log.date] = [];
      acc[log.date].push(log);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
    b.localeCompare(a)
  ); // mới -> cũ

  if (!sortedDates.length) {
    return (
      <Card className="mt-2 border-dashed bg-muted/20 p-4 text-xs text-muted-foreground">
        Không có nhật ký nào phù hợp với bộ lọc hiện tại. Hãy điều chỉnh bộ lọc
        ở phía trên.
      </Card>
    );
  }

  return (
    <div className="mt-1 rounded-lg border bg-card/60 p-3">
      <div className="mb-2 text-[11px] text-muted-foreground">
        Nhật ký được nhóm theo <span className="font-semibold">ngày</span>, hiển
        thị theo dạng <span className="font-semibold">mốc thời gian dọc</span>{" "}
        để dễ theo dõi diễn biến sức khỏe, khẩu phần và sản lượng của đàn.
      </div>

      <div className="relative">
        {/* Trục dọc chung */}
        <div className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-muted-foreground/30" />

        <div className="space-y-4">
          {sortedDates.map((date) => {
            const logsInDay = groupedByDate[date].sort((a, b) =>
              (b.time ?? "").localeCompare(a.time ?? "")
            );
            const warningCount = logsInDay.filter(
              (l) => l.status === "warning"
            ).length;
            const criticalCount = logsInDay.filter(
              (l) => l.status === "critical"
            ).length;

            const dateLabel = new Date(date).toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <section key={date} className="flex gap-3">
                {/* Mốc ngày bên trái */}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="mt-1 flex-1 w-px bg-muted-foreground/30" />
                  </div>
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 space-y-2">
                  {/* Header ngày */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {dateLabel}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {logsInDay.length} dòng nhật ký •{" "}
                        <span className="font-medium">
                          {countDistinctAnimals(logsInDay)} con vật
                        </span>{" "}
                        được ghi nhận
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <MetricPill
                        label="Cảnh báo"
                        value={`${warningCount} log`}
                      />
                      <MetricPill
                        label="Nguy cấp"
                        value={`${criticalCount} log`}
                      />
                    </div>
                  </div>

                  {/* Danh sách log trong ngày */}
                  <div className="space-y-2">
                    {logsInDay.map((log, idx) => (
                      <TimelineItem
                        key={log.id}
                        log={log}
                        isFirst={idx === 0}
                        isLast={idx === logsInDay.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────── Sub components ───────── */

function TimelineItem({
  log,
  isFirst,
  isLast,
}: {
  log: LivestockLog;
  isFirst: boolean;
  isLast: boolean;
}) {
  const typeMeta = getLogTypeMeta(log.logType);
  const statusMeta = getStatusMeta(log.status);

  return (
    <div className="relative flex gap-3">
      {/* Cột mốc nhỏ cho từng log */}
      <div className="relative flex flex-col items-center">
        {/* nối line trên/dưới cho đẹp */}
        {!isFirst && (
          <div className="absolute top-0 bottom-1/2 w-px bg-muted-foreground/30" />
        )}
        {!isLast && (
          <div className="absolute top-1/2 bottom-0 w-px bg-muted-foreground/30" />
        )}

        <div className="z-10 flex h-4 w-4 items-center justify-center rounded-full border bg-background">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              statusMeta.dotClass ?? "bg-slate-400"
            )}
          />
        </div>
      </div>

      {/* Card nội dung */}
      <Card className="flex-1 border-muted-foreground/30 bg-card/95 p-2.5 text-xs shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {log.time} • {log.farm} • {log.group}
            </p>
            <p className="mt-0.5 text-xs font-semibold">
              {log.animalName}{" "}
              <span className="font-normal text-[11px] text-muted-foreground">
                (Thẻ tai: <span className="font-mono">{log.animalTag}</span>)
              </span>
            </p>
            <p className="mt-0.5 text-xs">{log.title}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 border px-1.5 py-0.5 text-[10px]",
                typeMeta.badgeClass
              )}
            >
              {typeMeta.icon}
              <span>{typeMeta.label}</span>
            </Badge>
            <Badge
              className={cn("px-1.5 py-0.5 text-[10px]", statusMeta.badgeClass)}
            >
              {statusMeta.label}
            </Badge>
          </div>
        </div>

        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
          {log.detail}
        </p>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
          <span>Người ghi: {log.recorder}</span>
          <span className="inline-flex items-center gap-1">
            <PawPrint className="h-3 w-3" />
            Mã: {log.id}
          </span>
        </div>
      </Card>
    </div>
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

/* ───────── Helpers ───────── */

function countDistinctAnimals(logs: LivestockLog[]) {
  return new Set(logs.map((l) => l.animalTag)).size;
}

function getLogTypeMeta(logType: LivestockLog["logType"]) {
  switch (logType) {
    case "feeding":
      return {
        label: "Cho ăn & dinh dưỡng",
        icon: <Wheat className="h-3 w-3 text-lime-600" />,
        badgeClass: "border-lime-200 bg-lime-50 text-lime-700",
      };
    case "health":
      return {
        label: "Khám sức khỏe",
        icon: <Stethoscope className="h-3 w-3 text-amber-600" />,
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "treatment":
      return {
        label: "Điều trị",
        icon: <Stethoscope className="h-3 w-3 text-red-600" />,
        badgeClass: "border-red-200 bg-red-50 text-red-700",
      };
    case "breeding":
      return {
        label: "Phối giống / sinh sản",
        icon: <Droplets className="h-3 w-3 text-sky-600" />,
        badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
      };
    case "environment":
      return {
        label: "Chuồng trại & môi trường",
        icon: <Sparkles className="h-3 w-3 text-teal-600" />,
        badgeClass: "border-teal-200 bg-teal-50 text-teal-700",
      };
    case "growth":
      return {
        label: "Tăng trưởng",
        icon: <Activity className="h-3 w-3 text-violet-600" />,
        badgeClass: "border-violet-200 bg-violet-50 text-violet-700",
      };
    case "production":
      return {
        label: "Sản lượng",
        icon: <Droplets className="h-3 w-3 text-blue-600" />,
        badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case "movement":
      return {
        label: "Di chuyển / vận động",
        icon: <PawPrint className="h-3 w-3 text-slate-600" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
      };
    default:
      return {
        label: "Khác",
        icon: <PawPrint className="h-3 w-3 text-slate-600" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
      };
  }
}

function getStatusMeta(status: LivestockLog["status"]) {
  if (status === "normal") {
    return {
      label: "Ổn định",
      badgeClass: "bg-emerald-100 text-emerald-700",
      dotClass: "bg-emerald-500",
    };
  }
  if (status === "warning") {
    return {
      label: "Cần theo dõi",
      badgeClass: "bg-amber-100 text-amber-800",
      dotClass: "bg-amber-500",
    };
  }
  if (status === "critical") {
    return {
      label: "Nguy cấp",
      badgeClass: "bg-red-100 text-red-700",
      dotClass: "bg-red-500",
    };
  }
  return {
    label: status,
    badgeClass: "bg-slate-100 text-slate-700",
    dotClass: "bg-slate-400",
  };
}
