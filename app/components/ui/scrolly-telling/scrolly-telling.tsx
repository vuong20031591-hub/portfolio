import { useRef, type ReactNode } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import styles from "./scrolly-telling.module.css";
import { cn } from "~/lib/utils";

interface ScrollyTellingProps {
  items: {
    title: string;
    text: string;
    visual: ReactNode;
  }[];
  className?: string;
}

export function ScrollyTelling({ items, className }: ScrollyTellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(items.length - 1) * 100}%`]);

  return (
    <div
      ref={containerRef}
      className={cn(styles.container, className)}
      style={{ height: `${items.length * 100}vh`, position: "relative" }}
    >
      <div className={styles.stickyWrapper}>
        <motion.div style={{ x }} className={styles.cardsTrack}>
          {items.map((item, index) => (
            <div key={index} className={styles.cardContainer}>
              <div className={styles.card}>
                {/* Visual area - ảnh tròn bên trái */}
                <div className={styles.visualArea}>
                  <motion.div
                    className={styles.visualCircle}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                    viewport={{ amount: 0.5 }}
                  >
                    {item.visual}
                  </motion.div>
                </div>

                {/* Text area - nội dung bên phải */}
                <motion.div
                  className={styles.textArea}
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ amount: 0.5 }}
                >
                  {/* Số thứ tự mờ phía sau */}
                  <div className={styles.cardNumber}>0{index + 1}</div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.text}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
