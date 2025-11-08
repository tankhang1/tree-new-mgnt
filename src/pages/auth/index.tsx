"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f7f9fc]">
      <Card className="w-full max-w-md rounded-xl border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.12)]">
        <CardHeader className="space-y-1 pb-4 pt-8 text-center">
          <h1 className="text-2xl font-bold text-primary">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-slate-600">
            Vui lòng nhập thông tin tài khoản để tiếp tục
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-800"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center rounded-md border border-slate-200 bg-white px-3">
                <Mail className="mr-2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="h-10 border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-800"
              >
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center rounded-md border border-slate-200 bg-white px-3">
                <Lock className="mr-2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-10 border-0 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="ml-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-700 font-semibold"
              >
                Quên mật khẩu?
              </button>
            </div>

            <Button
              type="submit"
              className="mt-2 h-11 w-full rounded-md font-semibold bg-primary!"
              onClick={() => navigate("/main")}
            >
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
