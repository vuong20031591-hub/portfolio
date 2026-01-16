import { Quote } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar/avatar";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { useLanguage } from "~/contexts/language";
import styles from "./testimonials-section.module.css";
import type { TestimonialItem } from "./testimonials-section.types";

/** Icon images cho các values - local WebP files */
const VALUE_ICONS = [
  "/images/values/clean-code.webp",
  "/images/values/growth-mindset.webp",
  "/images/values/user-first.webp",
  "/images/values/humility.webp",
  "/images/values/passion.webp",
  "/images/values/never-stop-learning.webp",
];

/**
 * TestimonialsSection - Hiển thị values/philosophy dạng marquee
 */
export function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials: TestimonialItem[] = t.testimonials.items.map((item, index) => ({
    ...item,
    avatar: VALUE_ICONS[index] || VALUE_ICONS[0],
  }));

  return (
    <section className={styles.testimonialsSection} id="values">
      <ScrollReveal variant="fade-up" width="100%">
        <h2 className={styles.sectionTitle}>{t.testimonials.title}</h2>
        <p className={styles.sectionSubtitle}>{t.testimonials.subtitle}</p>
      </ScrollReveal>

      <div className={styles.marqueeContainer}>
        {/* First Row - Normal Scroll */}
        <div className={`${styles.marqueeTrack} ${styles.marqueeNormal}`}>
          {[...testimonials, ...testimonials].map((item, index) => (
            <TestimonialCard key={`row1-${index}`} item={item} />
          ))}
        </div>

        {/* Second Row - Reverse Scroll */}
        <div className={`${styles.marqueeTrack} ${styles.marqueeReverse}`}>
          {[...testimonials, ...testimonials].reverse().map((item, index) => (
            <TestimonialCard key={`row2-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Component hiển thị một testimonial card */
function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <Card className={styles.testimonialCard}>
      <CardContent className={styles.testimonialContent}>
        <Quote className={styles.quoteIcon} />
        <p className={styles.quoteText}>&ldquo;{item.quote}&rdquo;</p>
        <div className={styles.testimonialAuthor}>
          <Avatar className={styles.authorAvatar}>
            <AvatarImage src={item.avatar} alt={item.author} />
            <AvatarFallback>{item.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className={styles.authorName}>{item.author}</div>
            <div className={styles.authorTitle}>{item.title}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
