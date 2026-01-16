import { useEffect, useState } from "react";
import styles from "./spotlight.module.css";

interface SpotlightProps {
  size?: number;
  enabled?: boolean;
}

export function Spotlight({ size = 600, enabled = true }: SpotlightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Check if device has fine pointer (mouse)
    const hasFinPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [enabled, isVisible]);

  if (!enabled) return null;

  return (
    <div
      className={styles.spotlight}
      style={{
        "--spotlight-x": `${position.x}px`,
        "--spotlight-y": `${position.y}px`,
        "--spotlight-size": `${size}px`,
        opacity: isVisible ? 1 : 0,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
