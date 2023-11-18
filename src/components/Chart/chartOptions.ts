import dayjs from "dayjs";
import { ColorType } from "lightweight-charts";

const chartOptions = (width: number) => ({
  layout: {
    background: { type: ColorType.Solid, color: "#001529" },
    textColor: "white",
  },
  grid: {
    vertLines: {
      color: "#303C43",
    },
    horzLines: {
      color: "#303C43",
    },
  },
  localization: {
    dateFormat: "yyyy-MM-dd",
    locale: "en-US",
    priceFormatter: (p: number) => `$ ${p.toFixed(2)}`,
    timeFormatter: (t: string) => dayjs(t).format("YYYY-MM-DD"),
  },
  timeScale: {
    fixLeftEdge: true,
    rightBarStaysOnScroll: true,
    borderVisible: true,
    visible: true,
    minBarSpacing: 0,
    timeVisible: false,
    secondsVisible: false,
    tickMarkFormatter: (t: string) => dayjs(t).format("MMM-DD"),
  },
  width: width,
  height: 400,
});
export default chartOptions;
