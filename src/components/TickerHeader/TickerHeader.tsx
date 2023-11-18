"use client";

import { ArrowLeftOutlined, EditFilled, StarFilled } from "@ant-design/icons";
import { Button, DatePicker, Tooltip, Typography } from "antd";
import styles from "./style.module.scss";
import { formatDate, formatPrice, numberWithCommas } from "@/utils/utills";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TickerInterface } from "@/hooks/useGetTicker";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import TickerHeaderLoadingState from "./TickerHeaderLoadingState";
import {
  addNewFavorite,
  removeFavorite,
  useGetFavorites,
} from "@/hooks/useFavorites";
import { useAuth } from "@/utils/firebase/FirebaseAuthContext";
import { useQueryClient } from "@tanstack/react-query";
import queryKeys from "@/utils/queryKeys";

const { Title, Text } = Typography;

interface TickerHeaderInterface {
  data?: TickerInterface;
  isLoading: boolean;
  setDate: Dispatch<SetStateAction<string>>;
}

const TickerHeader = ({ data, isLoading, setDate }: TickerHeaderInterface) => {
  const router = useRouter();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const { data: favorites } = useGetFavorites(user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (favorites && data) {
      if (favorites.findIndex((e) => e.symbol == data?.symbol) !== -1) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [favorites, data]);

  // Handle date change in the DatePicker
  const onDateChange = (date: Dayjs | null) => {
    // Add one day to the selected date and format it
    setDate(dayjs(date).add(1, "day").format("YYYY-MM-DD"));
    setDatePickerOpen(false);
  };

  const setNewFavorites = (newFavorties: TickerInterface[]) => {
    queryClient.setQueryData([queryKeys.FAVORITES, user], newFavorties);
  };

  const handleClickFavorite = async () => {
    if (data) {
      if (isFavorite) {
        const newFavorites = await removeFavorite(user, data.symbol);
        setNewFavorites(newFavorites);
      } else {
        const newFavorites = await addNewFavorite(user, data);
        setNewFavorites(newFavorites);
      }
    }
  };

  return isLoading ? (
    <TickerHeaderLoadingState />
  ) : (
    <div className={styles.topHeader}>
      <div>
        <Button
          className={styles.backButton}
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Title className={styles.title} level={3}>
          {data?.name}
          <label>{` (${data?.symbol})`}</label>
          <Tooltip
            title={`${
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }`}
          >
            <Button
              shape="circle"
              onClick={handleClickFavorite}
              className={`${styles.favoriteButton} ${
                isFavorite ? styles.favoriteChecked : ""
              }`}
              icon={<StarFilled />}
            />
          </Tooltip>
        </Title>
        <Text>
          Listed on <b>{data?.exchange_name}</b>{" "}
          {` (${data?.acronym} - ${data?.country})`}
        </Text>
        <div>
          {!isLoading && (
            <Text>
              Date: <b>{formatDate(data?.date ?? "")}</b>
            </Text>
          )}
          <Tooltip title="Select different date">
            <Button
              data-testId="edit-date-button"
              onClick={() => setDatePickerOpen(true)}
              type="text"
              icon={<EditFilled />}
            >
              <DatePicker
                value={dayjs(data?.date)}
                open={datePickerOpen}
                onOpenChange={setDatePickerOpen}
                className={styles.datePicker}
                onChange={onDateChange}
                defaultValue={dayjs().subtract(1, "day")}
                disabledDate={(current) =>
                  current.valueOf() >= dayjs().subtract(1, "day").valueOf()
                }
              />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className={styles.pricesContainer}>
        <p className={styles.green}>
          <label>Highest: </label>
          {formatPrice(data?.high_price)}
        </p>
        <p className={styles.red}>
          <label>Lowest: </label>
          {formatPrice(data?.low_price)}
        </p>
        <p>
          <label>Opening Price: </label>
          {formatPrice(data?.open_price)}
        </p>
        <p>
          <label>Closing Price: </label>
          {formatPrice(data?.close_price)}
        </p>
        <p>
          <label>Volume: </label>
          {numberWithCommas(data?.volume?.toString() ?? "")}
        </p>
      </div>
    </div>
  );
};
export default TickerHeader;
