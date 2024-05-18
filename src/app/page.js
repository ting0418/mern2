"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../app/components/nav";
import HomeComponent from "../app/components/home";
export default function Home() {
  return (
    <>
      <Nav />
      <HomeComponent />
    </>
  );
}
