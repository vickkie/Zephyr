import AnimatedCursor from "react-animated-cursor";
import { useState, useEffect } from "react";

const Cursor = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  if (isMobile) {
    return;
  }
  return (
    <AnimatedCursor
      innerSize={12}
      outerSize={35}
      color="206, 189, 99"
      // color='255, 255, 255'
      // color='0, 0, 0'
      outerAlpha={0.2}
      innerScale={0.7}
      outerScale={3}
      outerStyle={{
        mixBlendMode: "exclusion",
      }}
      hasBlendMode={true}
      clickables={[
        "a",
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        "label[for]",
        "select",
        "textarea",
        "button",
        ".link",
        {
          target: ".no-custom-cursor",
          options: {
            innerSize: 1,
            outerSize: 1,
            color: "#000",
            outerAlpha: 0.3,
            innerScale: 0.7,
            outerScale: 4,
          },
        },
      ]}
    />
  );
};

export default Cursor;
