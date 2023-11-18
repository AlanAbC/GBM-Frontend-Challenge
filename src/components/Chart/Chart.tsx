"use client";
import { DatePicker, Select, Tag } from "antd";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import dayjs from "dayjs";
import { TickerEODDataInterface } from "@/hooks/useGetTickerEODData";
import { colors } from "@/utils/style-utils";
import chartOptions from "./chartOptions";

const displayOptions = [
  { label: "Low Price", value: "low_price" },
  { label: "High Price", value: "high_price" },
  { label: "Open Price", value: "open_price" },
  { label: "Close Price", value: "close_price" },
];

const { RangePicker } = DatePicker;

export interface ChartInterface {
  chartData?: TickerEODDataInterface;
  setChartDateRange: Dispatch<SetStateAction<string[]>>;
}

const Chart = ({ chartData, setChartDateRange }: ChartInterface) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [openLineSeries, setOpenLineSeries] =
    useState<ISeriesApi<"Line"> | null>(null);
  const [closeLineSeries, setCloseLineSeries] =
    useState<ISeriesApi<"Line"> | null>(null);
  const [highLineSeries, setHighLineSeries] =
    useState<ISeriesApi<"Line"> | null>(null);
  const [lowLineSeries, setLowLineSeries] = useState<ISeriesApi<"Line"> | null>(
    null
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    // Create the chart when the component mounts
    if (chartContainerRef.current && !chart && !chartLoaded) {
      setChart(
        createChart(
          chartContainerRef?.current,
          chartOptions(chartContainerRef.current.clientWidth)
        )
      );
      setChartLoaded(true);
    }
  }, [chartContainerRef, chart, chartLoaded]);

  useEffect(() => {
    // Update the chart series when new data is available
    if (chartData && chartLoaded && chart) {
      if (openLineSeries) {
        openLineSeries.setData(chartData.open);
      } else {
        const tempopenLineSeries = chart.addLineSeries({
          color: colors["open_price"],
          priceFormat: {
            type: "price",
          },
        });
        tempopenLineSeries.setData(chartData.open);
        setOpenLineSeries(tempopenLineSeries);
      }

      if (closeLineSeries) {
        closeLineSeries.setData(chartData.close);
      } else {
        const tempcloseLineSeries = chart.addLineSeries({
          color: colors["close_price"],
          priceFormat: {
            type: "price",
          },
        });
        tempcloseLineSeries.setData(chartData.close);
        setCloseLineSeries(tempcloseLineSeries);
      }

      if (highLineSeries) {
        highLineSeries.setData(chartData.high);
      } else {
        const temphighLineSeries = chart.addLineSeries({
          color: colors["high_price"],
          priceFormat: {
            type: "price",
          },
        });
        temphighLineSeries.setData(chartData.high);
        setHighLineSeries(temphighLineSeries);
      }

      if (lowLineSeries) {
        lowLineSeries.setData(chartData.low);
      } else {
        const templowLineSeries = chart.addLineSeries({
          color: colors["low_price"],
          priceFormat: {
            type: "price",
          },
        });
        templowLineSeries.setData(chartData.low);
        setLowLineSeries(templowLineSeries);
      }
      chart.timeScale().fitContent();
    }
  }, [
    chartData,
    chartLoaded,
    chart,
    highLineSeries,
    lowLineSeries,
    openLineSeries,
    closeLineSeries,
  ]);

  const hideOrShowLineData = (value: string, hide: boolean) => {
    switch (value) {
      case "low_price":
        if (hide) {
          lowLineSeries?.setData([]);
        } else {
          chartData && lowLineSeries?.setData(chartData?.low);
        }
        break;
      case "high_price":
        if (hide) {
          highLineSeries?.setData([]);
        } else {
          chartData && highLineSeries?.setData(chartData?.high);
        }
        break;
      case "open_price":
        if (hide) {
          openLineSeries?.setData([]);
        } else {
          chartData && openLineSeries?.setData(chartData?.open);
        }
        break;
      case "close_price":
        if (hide) {
          closeLineSeries?.setData([]);
        } else {
          chartData && closeLineSeries?.setData(chartData?.close);
        }
        break;
      default:
        break;
    }
  };

  const handleSelectValue = (newValue: string) => {
    hideOrShowLineData(newValue, false);
  };

  const handleUnselectValue = (removedValue: string) => {
    hideOrShowLineData(removedValue, true);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.datePicker}>
        {` Date range: `}
        <RangePicker
          className={styles.rangePicker}
          defaultValue={[dayjs(), dayjs().subtract(30, "day")]}
          disabledDate={(current) =>
            current.valueOf() >= dayjs().subtract(1, "day").valueOf()
          }
          open={datePickerOpen}
          onOpenChange={setDatePickerOpen}
          onChange={(values) => {
            if (values) {
              const dateRange = [
                dayjs(values[0]).format("YYYY-MM-DD"),
                dayjs(values[1]).format("YYYY-MM-DD"),
              ];
              setChartDateRange(dateRange);
            }
          }}
        />
      </div>
      <div ref={chartContainerRef} />
      <div className={styles.displayOption}>
        {` Display Options: `}
        <Select
          className={styles.select}
          mode="tags"
          size="middle"
          placeholder="Select options to display"
          tagRender={({ value, label }) => (
            //@ts-ignore
            <Tag color={colors[value]}>{label}</Tag>
          )}
          onSelect={handleSelectValue}
          onDeselect={handleUnselectValue}
          options={displayOptions}
          defaultValue={[
            "low_price",
            "high_price",
            "open_price",
            "close_price",
          ]}
        />
      </div>
    </div>
  );
};

export default Chart;
