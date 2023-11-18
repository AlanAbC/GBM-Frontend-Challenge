"use client";

import { Skeleton } from "antd";
import styles from "./style.module.scss";

const TickerHeaderLoadingState = () => {
  return (
    <div data-testid="header-skeleton" className={styles.topHeader}>
      <div>
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
      </div>
      <div className={styles.pricesContainer}>
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
        <Skeleton
          className={styles.skeleton}
          title
          active
          paragraph={{ rows: 0 }}
        />
      </div>
    </div>
  );
};

export default TickerHeaderLoadingState;
