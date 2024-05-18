"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const CourseComponent = () => {
  const Router = useRouter();
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
  const joinCourse = async (courseId) => {
    try {
      const token = getCookie("token");
      console.log(token); // 從 cookie 中獲取 token
      if (!token) {
        console.error("Token not found in cookie");
        return;
      }
      if (role == "instructor") {
        Swal.fire({
          title: "錯誤",
          text: "只有身分為講師才可以報名課程喔!",
          icon: "error",
        });
        return;
      }
      const response = await axios.post(
        `http://localhost:3005/api/courses/joinCourse/${courseId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: token,
          },
        }
      );

      // 更新 courseData 中對應課程的學生人數
      const updatedCourseData = courseData.map((course) => {
        if (course._id === courseId) {
          // 更新該課程的學生人數
          return { ...course, students: response.data.students };
        }
        return course;
      });
      console.log(updatedCourseData);
      // 更新 courseData 狀態
      setCourseData(updatedCourseData);
      Swal.fire({
        title: "成功",
        text: "您已報名成功!",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to join course:", error);
      Swal.fire({
        title: "錯誤",
        text: "報名課程失敗，請稍後再試!",
        icon: "error",
      });
    }
  };
  // 先利用axios.get把所有課程列表抓出來
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 從 Cookie 中獲取完整的 Cookie 字串
        const token = getCookie("token");

        console.log("course46 token:" + token);
        if (!token) {
          console.error("Token not found in cookie");
          return;
        }

        const response = await axios.get("http://localhost:3005/api/courses", {
          withCredentials: true,
          headers: {
            Authorization: token, // 將 Token 放在 Authorization 標頭中
          },
        });
        setCourseData(response.data);

        console.log(response.data);
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
      {/* {id && role == "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面。</h1>
        </div>
      )}
      {id && role == "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面。</h1>
        </div>
      )} */}
      {id && (
        <div className=" d-flex align-items-end ">
          <h1 className="">課程頁面</h1>
          <p className="">總共有 {courseData ? courseData.length : 0}筆課程</p>
        </div>
      )}
      {id && courseData && courseData.length != 0 && (
        <div
          className="justify-content-center"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {courseData.map((course) => {
            return (
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
                  onClick={() => {
                    joinCourse(course._id);
                  }}
                  className="btn btn-primary"
                >
                  報名
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
