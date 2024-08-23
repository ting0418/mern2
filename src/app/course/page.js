"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { addToCart } from "@/app/lib/features/cartSlice";

const CourseComponent = () => {
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const [courseData, setCourseData] = useState(null);

  // 獲取用戶信息和購物車狀態
  const { id, username, role, cart } = useAppSelector((state) => {
    if (state.user && state.user.user) {
      return {
        id: state.user.user.user._id,
        username: state.user.user.user.username,
        role: state.user.user.user.role,
        cart: state.cart,
      };
    } else {
      return {
        id: null,
        username: null,
        role: null,
        cart: [],
      };
    }
  });

  // 獲取 Cookie
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

  // 報名課程（加入購物車）處理邏輯
  const joinCourse = async (course) => {
    // 如果用戶是講師，不允許報名
    if (role === "instructor") {
      Swal.fire({
        title: "錯誤",
        text: "只有身分為學生才可以購買課程喔!",
        icon: "error",
      });
      return;
    }

    try {
      const token = getCookie("token");

      // 檢查是否已購買課程
      const response = await axios.post(
        "http://localhost:3005/api/courses/check-enrollment",
        { courseId: course._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.enrolled) {
        Swal.fire({
          title: "提示",
          text: "您已經購買過此課程。",
          icon: "info",
        });
        return;
      }
      console.log(cart);

      // 檢查是否已在購物車中
      const courseAlreadyInCart = cart.some(
        (cartItem) => cartItem._id === course._id
      );

      if (courseAlreadyInCart) {
        Swal.fire({
          title: "提示",
          text: "此課程已經在購物車中！",
          icon: "info",
        });
      } else {
        // 如果課程不在購物車中，則加入購物車
        dispatch(addToCart(course));
        Swal.fire({
          title: "已加入購物車",
          text: "請至購物車結帳",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("失敗:", error);
      Swal.fire({
        title: "錯誤",
        text: "無法檢查課程購買狀態，請稍後再試。",
        icon: "error",
      });
    }
  };

  // 獲取所有課程資料
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = getCookie("token");

        if (!token) {
          console.error("Token not found in cookie");
          return;
        }

        const response = await axios.get("http://localhost:3005/api/courses", {
          withCredentials: true,
          headers: {
            Authorization: token,
          },
        });
        setCourseData(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // 課程列表展示
  return (
    <div style={{ padding: "3rem" }}>
      {!username && (
        <div>
          <p>您必須先登入才能看到課程。</p>
          <button
            onClick={() => {
              Router.push("/login");
            }}
            className="btn btn-primary btn-lg"
          >
            回到登入頁面
          </button>
        </div>
      )}

      {id && (
        <div className="container d-flex align-items-end justify-content-between">
          <h1 className="flex-grow-1 text-center">課程頁面</h1>
          <p className="">總共有 {courseData ? courseData.length : 0}筆課程</p>
        </div>
      )}
      {id && courseData && courseData.length !== 0 && (
        <div
          className="justify-content-center"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {courseData.map((course) => (
            <div
              key={course._id}
              className="card"
              style={{ width: "18rem", margin: "1rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">課程名稱:{course.title}</h5>
                <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                  {course.description}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>
                  學生人數: {course.students.length}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>
                  課程價格: {course.price}
                </p>
              </div>
              <button
                onClick={() => joinCourse(course)}
                className="btn btn-primary"
              >
                加入購物車
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
