"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import { Ticker, useGetTickers } from "../hooks/useGetTickers";
import { Table, Input, Typography, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import queryKeys from "../utils/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/utills";
import Sidebar from "@/components/Sidebar";
import { StockOutlined } from "@ant-design/icons";
import SidebarWrapper from "@/utils/SidebarWrapper";

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
    title: "EOD Close Price",
    dataIndex: "close_price",
    key: "close_price",
    render: (text) => <p>{formatPrice(Number(text))}</p>,
  },
];

const { Search } = Input;

const Tickers = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, isFetching } = useGetTickers(
    currentPage - 1,
    searchValue
  );

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearchValue(value);
  };

  return (
    <SidebarWrapper>
      <div className={styles.topHeader}>
        <StockOutlined className={styles.icon} />
        <br />
        <Search
          placeholder="Search Stock Ticker"
          onSearch={onSearch}
          style={{ width: 300 }}
        />
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
            pagination={{
              pageSize: 15,
              total: data?.pagination.total,
              current: currentPage,
              showSizeChanger: false,
              className: styles.pagination,
              onChange: (number) => {
                setCurrentPage(number);
                queryClient.invalidateQueries({
                  queryKey: [
                    queryKeys.TICKERS,
                    {
                      page: currentPage - 1,
                    },
                  ],
                });
              },
            }}
            columns={columns}
            loading={isFetching || isLoading}
            dataSource={data?.tickers ?? []}
          />
        )}
      </div>
    </SidebarWrapper>
  );
};
export default Tickers;
