"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import axios from "axios";
export default function Page() {
  const { isLoggedIn, user } = useAppSelector((state) => state.user || {});

  const { id } = user || {};

  // const { isLoggedIn, id, username, email, date, role } = useAppSelector(
  //   (state) => ({
  //     isLoggedIn: state.user.isLoggedIn,
  //     id: state.user.user.user._id,
  //     username: state.user.user.user.username,
  //     email: state.user.user.user.email,
  //     role: state.user.user.user.role,
  //     date: state.user.user.user.date,
  //   })
  // );
  const Router = useRouter();
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [message, setMessage] = useState("");
  const handleTakeToLogin = () => {
    Router.push("/login");
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const postCourse = () => {
    const token = getCookie("token");

    console.log(token);
    if (!token) {
      console.error("Token not found in cookie");
      return;
    }
    axios
      .post(
        "http://localhost:3005/api/courses",
        {
          title: title,
          description: description,
          price: price,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: token, // 將 Token 放在 Authorization 標頭中
          },
        }
      )
      .then(() => {
        Swal.fire({
          title: "成功",
          text: "新課程已創建成功",
          icon: "success",
        });
        Router.push("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null; // 找不到指定名稱的 Cookie 則返回 null
  };
  useEffect(() => {
    // 檢查身分是否為講師，如果不是則顯示錯誤訊息
    if (id && role !== "instructor") {
      Swal.fire({
        title: "錯誤",
        text: "只有身分為講師才可以進行新增課程哦!",
        icon: "error",
      }).then(() => {
        Router.push("/");
      });
    }
  }, []);
  return (
    <div style={{ padding: "3rem" }}>
      <h1 className="mt-1 text-center">新增課程</h1>
      {!isLoggedIn && (
        <div>
          <p>在發布新課程之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {id && role == "instructor" && (
        <div className="form-group">
          <label for="exampleforTitle">課程標題：</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeTitle}
          />
          <br />
          <label for="exampleforContent">內容：</label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="content"
            onChange={handleChangeDesciption}
          />
          <br />
          <label for="exampleforPrice">價格：</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            onChange={handleChangePrice}
          />
          <br />
          <button className="btn btn-primary" onClick={postCourse}>
            交出表單
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
