"use client";

import { type Milestone } from "./FarmingLogs"; // giữ import type này

import {
  CalendarDays,
  ClipboardList,
  MapPin,
  Sprout,
  Droplets,
  SunMedium,
  Bug,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Leaf,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ====== Nếu chưa có type ở file khác thì dùng 2 alias này (đúng với mẫu bạn đưa) ====== */
type ActivityStatus = "done" | "in-progress" | "pending";
type ActivityType =
  | "watering"
  | "fertilizing"
  | "spraying"
  | "inspection"
  | "planting"
  | "harvesting"
  | "other";

type Props = {
  filteredLogs: Milestone[];
};

export default function MilestoneTimeline({ filteredLogs }: Props) {
  if (!filteredLogs.length) {
    return (
      <Card className="mt-2 border-dashed bg-muted/20 p-4 text-xs text-muted-foreground">
        Không có hoạt động nào phù hợp với bộ lọc hiện tại. Hãy điều chỉnh bộ
        lọc phía trên.
      </Card>
    );
  }

  // sắp xếp mới → cũ
  const sorted = [...filteredLogs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mt-1 rounded-lg border bg-card/60 p-3">
      <div className="mb-2 text-[11px] text-muted-foreground">
        Lịch sử canh tác được nhóm theo{" "}
        <span className="font-semibold">ngày</span>, hiển thị dạng{" "}
        <span className="font-semibold">mốc thời gian dọc</span> để dễ cuộn xem
        diễn biến tưới nước, bón phân, phun thuốc và kiểm tra đồng ruộng.
      </div>

      <div className="relative">
        {/* trục dọc */}
        <div className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-muted-foreground/30" />

        <div className="space-y-6">
          {sorted.map((m) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Card từng mốc ngày ───────── */

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const total = milestone.activities.length;
  const done = milestone.activities.filter((a) => a.status === "done").length;
  const spraying = milestone.activities.filter(
    (a) => a.type === "spraying"
  ).length;

  const dateLabel = new Date(milestone.date).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className="flex gap-3">
      {/* mốc ngày bên trái */}
      <div className="relative">
        <div className="flex flex-col items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="mt-1 flex-1 w-px bg-muted-foreground/30" />
        </div>
      </div>

      {/* nội dung bên phải */}
      <div className="flex-1">
        <Card className="border bg-card/90 p-3 shadow-sm">
          {/* Header ngày + meta */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">
                {dateLabel}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {milestone.phase}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Sprout className="h-3 w-3 text-emerald-600" />
                  Cây chính:{" "}
                  <span className="font-medium text-foreground">
                    {milestone.mainCrop}
                  </span>
                </span>

                {milestone.weather && (
                  <span className="inline-flex items-center gap-1">
                    <SunMedium className="h-3 w-3 text-amber-500" />
                    {milestone.weather}
                    {milestone.tempRange && ` • ${milestone.tempRange}`}
                  </span>
                )}

                {milestone.soilMoisture && (
                  <span className="inline-flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-sky-500" />
                    Ẩm độ đất: {milestone.soilMoisture}
                  </span>
                )}

                {milestone.pestRisk && (
                  <span className="inline-flex items-center gap-1">
                    <Bug
                      className={cn(
                        "h-3 w-3",
                        milestone.pestRisk === "high"
                          ? "text-red-500"
                          : milestone.pestRisk === "medium"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      )}
                    />
                    Nguy cơ sâu bệnh:{" "}
                    <span className="font-medium text-foreground">
                      {milestone.pestRisk === "high"
                        ? "Cao"
                        : milestone.pestRisk === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* summary bên phải */}
            <div className="flex flex-col items-start md:items-end gap-1 text-[11px]">
              <div className="inline-flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1">
                <ClipboardList className="h-3 w-3 text-primary" />
                <span className="font-medium text-foreground">
                  {total} hoạt động
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Hoàn thành: {done}
                </Badge>
                {spraying > 0 && (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]"
                  >
                    <Leaf className="mr-1 h-3 w-3" />
                    Phun / xử lý: {spraying}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* danh sách activity trong ngày */}
          <div className="space-y-2">
            {milestone.activities.map((a, idx) => (
              <TimelineItem
                key={`${milestone.id}-${idx}`}
                activity={a}
                isFirst={idx === 0}
                isLast={idx === milestone.activities.length - 1}
              />
            ))}
          </div>

          {/* cảnh báo nếu nguy cơ sâu bệnh cao */}
          {milestone.pestRisk === "high" && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[11px] text-red-700">
              <AlertTriangle className="h-3 w-3" />
              <span>
                Lưu ý: Nguy cơ sâu bệnh cao trong ngày này – cần tăng cường theo
                dõi mép ruộng và vùng trũng.
              </span>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

/* ───────── Item từng hoạt động ───────── */

type ActivityOfMilestone = Milestone["activities"][number];

function TimelineItem({
  activity,
  isFirst,
  isLast,
}: {
  activity: ActivityOfMilestone;
  isFirst: boolean;
  isLast: boolean;
}) {
  const typeMeta = getLogTypeMeta(activity.type as ActivityType);
  const statusMeta = getStatusMeta(activity.status as ActivityStatus);

  return (
    <div className="relative flex gap-3">
      {/* cột mốc nhỏ bên trái cho từng activity */}
      <div className="relative flex flex-col items-center">
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
      <Card className="flex-1 border-muted-foreground/30 bg-muted/30 p-2.5 text-xs shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted/50 hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              {typeMeta.icon}
              <span className="text-xs font-semibold">{activity.title}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {activity.plot} • {activity.areaName}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 border px-1.5 py-0.5 text-[10px]",
                typeMeta.badgeClass
              )}
            >
              {typeMeta.label}
            </Badge>
            <Badge
              className={cn("px-1.5 py-0.5 text-[10px]", statusMeta.badgeClass)}
            >
              {statusMeta.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              ⏰ {activity.time} • {activity.recorder}
            </span>
          </div>
        </div>

        <p className="mt-1 text-[11px] text-muted-foreground">
          {activity.detail}
        </p>
      </Card>
    </div>
  );
}

/* ───────── Helpers: meta cho loại hoạt động & trạng thái ───────── */

function getLogTypeMeta(type: ActivityType) {
  switch (type) {
    case "watering":
      return {
        label: "Tưới nước",
        icon: <Droplets className="h-3 w-3 text-sky-500" />,
        badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
      };
    case "fertilizing":
      return {
        label: "Bón phân",
        icon: <Sprout className="h-3 w-3 text-emerald-600" />,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "spraying":
      return {
        label: "Phun thuốc / chế phẩm",
        icon: <SunMedium className="h-3 w-3 text-amber-500" />,
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case "inspection":
      return {
        label: "Khảo sát / kiểm tra",
        icon: <Leaf className="h-3 w-3 text-lime-600" />,
        badgeClass: "border-lime-200 bg-lime-50 text-lime-700",
      };
    case "planting":
      return {
        label: "Gieo trồng",
        icon: <Sprout className="h-3 w-3 text-green-700" />,
        badgeClass: "border-green-200 bg-green-50 text-green-700",
      };
    case "harvesting":
      return {
        label: "Thu hoạch",
        icon: <CheckCircle2 className="h-3 w-3 text-emerald-700" />,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    default:
      return {
        label: "Hoạt động khác",
        icon: <ClipboardList className="h-3 w-3 text-slate-600" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-700",
      };
  }
}

function getStatusMeta(status: ActivityStatus) {
  if (status === "done") {
    return {
      label: "Hoàn thành",
      badgeClass: "bg-emerald-50 text-emerald-700",
      dotClass: "bg-emerald-500",
    };
  }
  if (status === "in-progress") {
    return {
      label: "Đang thực hiện",
      badgeClass: "bg-amber-50 text-amber-700",
      dotClass: "bg-amber-500",
    };
  }
  return {
    label: "Chưa làm",
    badgeClass: "bg-slate-50 text-slate-600",
    dotClass: "bg-slate-400",
  };
}
