import React from "react";

export default function Page() {
  return (
    <>
      <div className="container">
        <h1 className="text-center mt-2">Mern專案</h1>
        <h5 className=" mt-5">
          當我們說到MERN專案時，指的是一種使用特定技術堆疊構建的網頁應用程式。這個技術堆疊由四個主要的技術組成：
          <br />
          <br />
          1.MongoDB: 一個 NoSQL 資料庫，用於儲存應用程式的資料。MongoDB
          是一個基於文件的資料庫，適用於存儲非結構化或半結構化的資料。
          <br />
          <br />
          2.Express: 一個 Node.js
          的網頁伺服器框架，用於處理應用程式的後端邏輯和路由。
          <br />
          <br /> 3.React: 一個用於構建用戶界面的 JavaScript 庫。React
          是一個單頁應用程式（SPA）框架，可以有效地管理前端的狀態和 UI。
          <br />
          <br />
          4.Node.js: 一個運行在伺服器端的 JavaScript
          環境，用於構建應用程式的後端。Node.js 使用 JavaScript
          語言，因此可以在前端和後端使用相同的語言。
        </h5>
      </div>
    </>
  );
}
