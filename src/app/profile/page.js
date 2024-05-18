"use client";
import React from "react";
import { useAppSelector } from "@/app/lib/hooks";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
const Page = () => {
  const userData = useAppSelector((state) => state.user.user);
  const Router = useRouter();
  // 檢查用戶是否登錄
  if (!userData) {
    // 如果未登錄，顯示錯誤訊息
    Swal.fire({
      title: "錯誤",
      text: "您必須先登入才能查看個人資料。",
      icon: "error",
    });
    Router.push("/");
    // 返回空的組件，以避免渲染其他內容
    return null;
  }

  const { _id, username, email, date, role } = userData;
  return (
    <>
      <h1 className="text-center mt-2">我的個人資料</h1>
      <div className="m-5">
        <p>您的id是:{id}</p>
        <p>您的會員名稱是:{username}</p> <p>您的email是:{email}</p>
        <p>您的身分是:{role}</p>
        <p>您的註冊日期是:{date.split("T")[0]}</p>
      </div>
    </>
  );
};
export default Page;
