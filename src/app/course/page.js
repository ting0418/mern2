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
  const { id, username, role } = useAppSelector((state) => {
    if (state.user && state.user.user) {
      return {
        id: state.user.user.user._id,
        username: state.user.user.user.username,
        role: state.user.user.user.role,
      };
    } else {
      return {
        id: null,
        username: null,
        role: null,
      };
    }
  });

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

  const joinCourse = (course) => {
    if (role === "instructor") {
      Swal.fire({
        title: "錯誤",
        text: "只有身分為學生才可以購買課程喔!",
        icon: "error",
      });
      return;
    }
    dispatch(addToCart(course));
    Swal.fire({
      title: "已加入購物車",
      text: "請至購物車結帳",
      icon: "success",
    });
  };

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
      {id && courseData && courseData.length != 0 && (
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
