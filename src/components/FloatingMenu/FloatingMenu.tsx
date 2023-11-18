"use client";

import {
  HomeFilled,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import styles from "./styles.module.scss";
import TickerSearchModal from "../TickerSearchModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/firebase/FirebaseAuthContext";

const FloatingMenu = () => {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <FloatButton.Group
      className={styles.menu}
      trigger="click"
      type="primary"
      style={{ right: 24 }}
      icon={<MenuOutlined />}
    >
      {isModalOpen && (
        <TickerSearchModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <FloatButton
        onClick={() => setIsModalOpen(true)}
        icon={<SearchOutlined />}
      />
      <FloatButton onClick={() => router.replace("/")} icon={<HomeFilled />} />
      <FloatButton
        onClick={() => router.replace("/favorites")}
        icon={<StarFilled />}
      />
      <FloatButton
        onClick={() => {
          logout();
          router.replace("/login");
        }}
        icon={<LogoutOutlined />}
      />
    </FloatButton.Group>
  );
};
export default FloatingMenu;
