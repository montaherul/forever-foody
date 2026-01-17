import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import ReviewsSlider from "../components/ReviewsSlider";
import SmartRecommendations from "../components/SmartRecommendations";

const sectionVariant = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      variants={sectionVariant}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="py-10"
    >
      {children}
    </motion.section>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero (always visible, no scroll delay) */}
        <Hero />

        <AnimatedSection>
          <LatestCollection />
        </AnimatedSection>

        <AnimatedSection>
          <BestSeller />
        </AnimatedSection>

        <AnimatedSection>
          <SmartRecommendations />
        </AnimatedSection>

        <AnimatedSection>
          <ReviewsSlider />
        </AnimatedSection>

        <AnimatedSection>
          <OurPolicy />
        </AnimatedSection>

        <AnimatedSection>
          <NewsletterBox />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Home;
