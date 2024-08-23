"use client";
import React from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { removeFromCart, clearCart } from "@/app/lib/features/cartSlice";
import axios from "axios";
import Swal from "sweetalert2";

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

const CartPage = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  console.log(cart);
  const totalAmount = cart.reduce((acc, course) => acc + course.price, 0);
  const handleCheckout = async () => {
    try {
      const token = getCookie("token");

      if (!token) {
        console.error("Token not found in cookie");
        return;
      }
      const checkoutData = {
        cart: cart.map((course) => course._id), // 傳送課程ID列表到後端
        totalAmount: totalAmount, // 傳送總金額到後端
      };

      await axios.post(
        "http://localhost:3005/api/courses/checkout",
        checkoutData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      Swal.fire({
        title: "成功",
        text: "結帳成功!",
        icon: "success",
      }).then(dispatch(clearCart()));
    } catch (e) {
      console.error("Failed to checkout:", e.response);
      Swal.fire({
        title: "錯誤",
        text: e.response.data,
        icon: "error",
      });
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">購物車</h1>
      <ul>
        {cart.map((course, index) => (
          <li key={index}>
            {course.title} - $ {course.price}
            <button
              className="btn btn-warning"
              onClick={() => dispatch(removeFromCart(course._id))}
            >
              移除
            </button>
          </li>
        ))}
      </ul>
      <h2>總金額: ${totalAmount}</h2>
      <button className="btn btn-primary " onClick={handleCheckout}>
        結帳
      </button>
    </div>
  );
};

export default CartPage;
