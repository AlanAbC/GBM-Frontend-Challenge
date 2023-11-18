"use client";

import {
  HomeFilled,
  LogoutOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Button, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import TickerSearchModal from "../TickerSearchModal";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/firebase/FirebaseAuthContext";

type MenuItem = Required<MenuProps>["items"][number];

function createMenuItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// Define menu items
const menuItems: MenuItem[] = [
  createMenuItem("Home", "", <HomeFilled />),
  createMenuItem("Favorites", "favorites", <StarFilled />),
  createMenuItem("Logout", "logout", <LogoutOutlined />),
];

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const router = useRouter();

  // Highlight "Favorites" menu item when on favorites page
  useEffect(() => {
    if (pathname.includes("/favorites")) {
      setSelectedMenu("favorites");
    }
  }, [pathname]);

  return (
    <Sider width={250} className={styles.sidebar}>
      {isModalOpen && (
        <TickerSearchModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <p onClick={() => router.replace(`/`)} className={styles.title}>
        Stock Tickers
      </p>
      {pathname !== "/" && (
        <Button
          className={styles.searchButton}
          icon={<SearchOutlined />}
          type="primary"
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Search Tickers
        </Button>
      )}
      <Menu
        className={styles.menu}
        theme="dark"
        defaultSelectedKeys={["home"]}
        selectedKeys={[selectedMenu]}
        onClick={(e) => {
          if (e.key == "logout") {
            logout();
            router.replace("/login");
          } else {
            router.replace(`/${e.key}`);
          }
        }}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};
export default Sidebar;
