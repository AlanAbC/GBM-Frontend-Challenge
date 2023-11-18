"use client";
import { FloatButton } from "antd";
import styles from "./styles.module.scss";
import Sidebar from "@/components/Sidebar";
import {
  HomeFilled,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import FloatingMenu from "@/components/FloatingMenu";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.outContianer}>
      <FloatingMenu />
      <Sidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
