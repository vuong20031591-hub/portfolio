import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number; // negative for reverse direction
  aspectRatio?: string;
}

export const ParallaxImage = ({
  src,
  alt,
  className = "",
  style = {},
  speed = 0.2,
  aspectRatio = "16/9",
}: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Dynamic transform based on speed
  // speed > 0: image moves slower than scroll (parallax depth)
  // speed < 0: image moves faster/opposite
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio,
        width: "100%",
        ...style,
      }}
    >
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [`${-20 * speed}%`, `${20 * speed}%`]),
          width: "100%",
          height: "120%", // Taller to allow movement
          position: "absolute",
          top: "-10%",
          left: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </motion.div>
    </div>
  );
};
