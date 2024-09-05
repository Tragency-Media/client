import React, { useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import styles from "../styles/Carousel.module.css";
const Carousel = ({ images }) => {
  console.log("🚀 ~ Carousel ~ images:", images);
  const [active, setActive] = useState(0);
  const renderedCarousel = images.map((image, i) => {
    return (
      <img
        key={i}
        src={image}
        alt="Post"
        class={`post-media ${i === active ? styles.active : ""}`}
        style={{
          transform: `translateX(${
            (i - active) * (window.innerWidth + 100)
          }px)`,
          transition: "all 0.5s ease",
          opacity: `${i === active ? 1 : 0}`,
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
        }}
      />
    );
  });
  const changeActive = (move) => {
    if (active + move >= images.length || active + move < 0) return;
    setActive(active + move);
  };
  return (
    <section className={styles.carouselContainer}>
      {images.length > 1 ? (
        <>
          <i onClick={() => changeActive(-1)}>
            <FaArrowCircleLeft />
          </i>
          <i onClick={() => changeActive(1)}>
            {" "}
            <FaArrowCircleRight />
          </i>
        </>
      ) : null}
      {renderedCarousel}
    </section>
  );
};

export default Carousel;
