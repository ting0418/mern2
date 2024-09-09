"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/app/lib/hooks";

import { loginSuccess } from "../lib/features/userSlice";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3005/api/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("登入成功:", response.data.user.username);
      // console.log(response.data);
      //  將使用者資訊傳給store
      dispatch(loginSuccess(response.data));

      Swal.fire({
        title: "登入成功",
        text: "即將導回首頁",
        icon: "success",
      }).then(() => {
        // 將後端發送回來的token存在Cookie，有效期為1天
        Cookies.set("token", response.data.token, { expires: 1 });

        router.push("/");
      });
    } catch (e) {
      if (email == "") {
        Swal.fire({
          title: "登入失敗",
          text: "信箱不可為空",
          icon: "error",
        });
      } else {
        setMessage(e.response.data);
        console.error("登入失敗:", e.response.data);
      }

      // dispatch(loginFailure(e.response.data || "登入失敗，未提供授權！"));
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center pt-3">登入會員</h1>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label className="form-label" htmlFor="email">
            電子信箱:
          </label>
          <input
            placeholder="請填寫正確的電子信箱"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id="email"
            name="email"
            className="form-control"
            type="email"
          />
          <label className="form-label" htmlFor="password">
            密碼
          </label>
          <input
            placeholder="密碼長度需大於6"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            id="password"
            name="password"
            className="form-control"
            type="password"
          />
          <button
            onClick={() => {
              handleLogin();
            }}
            className="btn btn-primary mt-3"
          >
            登入
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
