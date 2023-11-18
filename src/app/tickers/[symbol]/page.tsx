"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import { useGetTicker } from "@/hooks/useGetTicker";
import { useParams } from "next/navigation";
import TickerHeader from "@/components/TickerHeader";
import Chart from "@/components/Chart";
import { useGetTickerEODData } from "@/hooks/useGetTickerEODData";
import dayjs from "dayjs";
import SidebarWrapper from "@/utils/SidebarWrapper";

const TickerDetail = () => {
  const { symbol }: { symbol: string } = useParams();
  const [date, setDate] = useState("");
  const [chartDateRange, setChartDateRange] = useState([
    dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ]);
  const { data, isLoading, isFetching } = useGetTicker(symbol, date);
  const { data: chartData } = useGetTickerEODData(
    symbol,
    chartDateRange[0],
    chartDateRange[1]
  );

  return (
    <SidebarWrapper>
      <TickerHeader setDate={setDate} data={data} isLoading={isLoading} />
      <div className={styles.bottomContainer}>
        <p className={styles.title}>End-of-Day Data</p>
        <Chart setChartDateRange={setChartDateRange} chartData={chartData} />
      </div>
    </SidebarWrapper>
  );
};
export default TickerDetail;
