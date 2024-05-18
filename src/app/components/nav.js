import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";

import { logout } from "../lib/features/userSlice";
const Nav = () => {
  const dispatch = useAppDispatch();

  const { isLoggedIn, username } = useAppSelector((state) => {
    if (state.user && state.user.user) {
      return {
        isLoggedIn: state.user.isLoggedIn,
        username: state.user.user.user.username,
      };
    } else {
      return {
        isLoggedIn: false,
        username: null,
      };
    }
  });
  console.log(username);
  console.log(isLoggedIn);
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3005/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("登出成功:", response.data);
      Swal.fire({
        title: "登出成功",
        text: "期待你的下次登入",
        icon: "success",
      });
      dispatch(logout());
    } catch (e) {
      console.log("登出失敗，請再試一次");
      console.log(e);
    }
  };
  return (
    <>
      <div>
        <nav>
          <nav className="navbar navbar-expand-lg navbar-light bg-light ">
            <div className="container d-flex justify-content-between ">
              <button
                className="navbar-toggler "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse " id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/" passHref>
                      <p className="nav-link active">首頁</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/register" passHref>
                      <p className="nav-link">註冊會員</p>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link href="/profile" passHref>
                      <p className="nav-link">個人頁面</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/course" passHref>
                      <p className="nav-link">課程頁面</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/postCourse" passHref>
                      <p className="nav-link">新增課程</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/enroll" passHref>
                      <p className="nav-link">註冊課程</p>
                    </Link>
                  </li>
                  {isLoggedIn === false && (
                    <li className="nav-item">
                      <Link href="/login" passHref>
                        <p className="nav-link">會員登入</p>
                      </Link>
                    </li>
                  )}
                  {isLoggedIn === true && (
                    <li className="nav-item">
                      <Link
                        href="/"
                        passHref
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        <span className="nav-link">登出</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              {username && (
                <div>
                  <p>{"您好！ " + username}</p>
                </div>
              )}
            </div>
          </nav>
        </nav>
      </div>
    </>
  );
};
export default Nav;
