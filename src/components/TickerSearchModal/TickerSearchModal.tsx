"use client";

import { Button, Input, List, Modal, Space } from "antd";
import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";

import styles from "./style.module.scss";
import {
  SearchTicker,
  useGetTickersSearch,
} from "@/hooks/useGetTickerSearchList";
import { useRouter } from "next/navigation";

const TickerSearchModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, isFetching } = useGetTickersSearch(searchValue);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSearchValue("");
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (value) => {
    setInputValue(value.target.value);
  };

  const onSearch = () => {
    setSearchValue(inputValue);
  };

  // Format each item in the search result list
  const formatDataItem = (item: SearchTicker) => {
    return `${item.name} (${item.symbol}) [${item.acronym}]`;
  };

  // Handle item click in the search result list
  const handleItemClick = (index: number) => {
    if (data) {
      // Replace the current URL with the selected ticker symbol
      router.replace(`/tickers/${data[index].symbol}`);
    }
  };

  return (
    <Modal
      title="Search Tickers"
      open={isModalOpen}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      className={styles.modal}
      onCancel={handleCancel}
    >
      <Space.Compact style={{ width: "100%", justifyContent: "center" }}>
        <Input
          className={styles.search}
          placeholder="Ticker name, symbol"
          onChange={handleChange}
          onKeyDown={(e) => e.key == "Enter" && onSearch()}
          value={inputValue}
          allowClear
          style={{ width: 350 }}
        />
        <Button onClick={onSearch} type="primary">
          Search
        </Button>
      </Space.Compact>
      <List
        loading={isLoading || isFetching}
        className={styles.list}
        bordered
        dataSource={data?.map((e) => formatDataItem(e))}
        renderItem={(item, index) => (
          <List.Item id={item} onClick={() => handleItemClick(index)}>
            {item}
          </List.Item>
        )}
      />
    </Modal>
  );
};
export default TickerSearchModal;
