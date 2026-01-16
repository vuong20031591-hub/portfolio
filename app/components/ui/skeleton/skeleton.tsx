import * as React from "react";
import classNames from "classnames";
import styles from "./skeleton.module.css";

/**
 * Skeleton - Base skeleton component với pulse animation
 * Dùng làm nền tảng cho các skeleton components khác
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={classNames(styles.skeleton, className)} {...props} />;
}

export { Skeleton };
