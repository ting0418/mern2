"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function Page() {
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  //   console.log(account);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("請選擇身分");
  // console.log(role);
  const registerMember = async () => {
    try {
      if (!email || !username || !password || !role) {
        // 如果標題、內容或類別有任何一個未輸入文字，顯示通知
        Swal.fire({
          title: "註冊失敗",
          text: "請確認是否有欄位未填寫！",
          icon: "error",
          confirmButtonText: "確定",
        });
        return; // 不繼續執行發布流程
      }
      const formData = {
        username: username,
        email: email,
        password: password,
        role: role,
      };

      const response = await axios.post(
        "http://localhost:3005/api/user/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "註冊成功",
        text: "將前往登入頁面",
        icon: "success",
        confirmButtonText: "確定",
      });
      // 在這裡處理回應
      console.log("註冊成功:" + response.data);
      Router.push("/login");
    } catch (error) {
      // 在這裡處理錯誤
      console.error("註冊失敗:", error);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center ">註冊會員</h1>
        <label htmlFor="username" className="form-label" />
        用戶名稱:
        <input
          id="username"
          name="username"
          type="text"
          className="form-control"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <label htmlFor="email" className="form-label" />
        電子郵件:
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor="password" className="form-label" />
        密碼:
        <input
          id="password"
          name="password"
          className="form-control"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <label htmlFor="role" className="form-label" />
        身分:
        <select
          name="role"
          id="role"
          className="form-control"
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option selected disabled>
            請選擇身份
          </option>
          <option value="student" id="student">
            學生
          </option>
          <option value="instructor" id="instructor">
            老師
          </option>
        </select>
        <button
          onClick={() => {
            registerMember();
          }}
          className="btn btn-primary mt-3 d-flex ms-auto"
        >
          送出
        </button>
      </div>
    </>
  );
}
