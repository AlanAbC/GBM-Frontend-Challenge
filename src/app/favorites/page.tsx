"use client";

import styles from "./styles.module.scss";
import { Ticker } from "../../hooks/useGetTickers";
import { Table, Spin, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { StarOutlined } from "@ant-design/icons";
import { removeFavorite, useGetFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/utils/firebase/FirebaseAuthContext";
import { TickerInterface } from "@/hooks/useGetTicker";
import queryKeys from "@/utils/queryKeys";
import SidebarWrapper from "@/utils/SidebarWrapper";

const Tickers = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isFetching } = useGetFavorites(user);

  const setNewFavorites = (newFavorties: TickerInterface[]) => {
    queryClient.setQueryData([queryKeys.FAVORITES, user], newFavorties);
  };

  const handleRemoveClick = async (symbol: string) => {
    const newFavorites = await removeFavorite(user, symbol);
    setNewFavorites(newFavorites);
  };

  const columns: ColumnsType<Ticker> = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Exchange Acronym",
      dataIndex: "acronym",
      key: "acronym",
      render: (text) => <p>{text ?? "-"}</p>,
    },
    {
      title: "Exchange Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveClick(record.symbol);
          }}
        >
          Remove from favorites
        </Button>
      ),
    },
  ];

  return (
    <SidebarWrapper>
      <div className={styles.topHeader}>
        <StarOutlined className={styles.icon} />
      </div>
      <div className={styles.bottomContainer}>
        {isLoading || isFetching ? (
          <Spin tip="Loading" size="large" />
        ) : (
          <Table
            onRow={(record) => {
              return {
                onClick: (e) => router.push(`tickers/${record.symbol}`),
              };
            }}
            rowClassName={styles.tableRow}
            pagination={false}
            columns={columns}
            loading={isFetching || isLoading}
            dataSource={data ?? []}
          />
        )}
      </div>
    </SidebarWrapper>
  );
};
export default Tickers;
