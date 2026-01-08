import { useEffect, useRef, useState } from "react";
import { Carousel } from "bootstrap";

const Slider = () => {
  const carouselRef = useRef(null);
  const carouselInstance = useRef(null);
  const timerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const SLIDE_TIME = 4000;
  const STEP = 32;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  const startProgress = () => {
    clearInterval(timerRef.current);
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        return prev + (STEP / SLIDE_TIME) * 100;
      });
    }, STEP);
  };

  useEffect(() => {
    if (!carouselRef.current) return;

    const images = carouselRef.current.querySelectorAll("img");
    let loadedCount = 0;

    const initCarousel = () => {
      carouselInstance.current = new Carousel(carouselRef.current, {
        interval: SLIDE_TIME,
        pause: false,
        wrap: true,
      });

      carouselRef.current.addEventListener(
        "slid.bs.carousel",
        startProgress
      );

      carouselInstance.current.cycle(); // ✅ FORCE START
      startProgress();
    };

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            initCarousel();
          }
        };
      }
    });

    // If all images already cached
    if (loadedCount === images.length) {
      initCarousel();
    }

    return () => {
      clearInterval(timerRef.current);
      carouselInstance.current?.dispose();
    };
  }, []);

  const dashOffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="container mt-4 position-relative">
      <div ref={carouselRef} className="carousel slide">
        <div className="carousel-inner">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <div
              key={num}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={`offer${num}.jpg`}
                className="d-block w-100"
                style={{ height: "450px" }}
                alt={`slide-${num}`}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          onClick={() => {
            carouselInstance.current.prev();
            startProgress();
          }}
        >
          <span className="carousel-control-prev-icon" />
        </button>

        <button
          className="carousel-control-next"
          type="button"
          onClick={() => {
            carouselInstance.current.next();
            startProgress();
          }}
        >
          <span className="carousel-control-next-icon" />
        </button>
      </div>

      {/* Circular Timer */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          right: "15px",
          width: "45px",
          height: "45px",
        }}
      >
        <svg width="45" height="45">
          <circle
            cx="22.5"
            cy="22.5"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="4"
          />
          <circle
            cx="22.5"
            cy="22.5"
            r={radius}
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.03s linear" }}
          />
        </svg>
      </div>
    </div>
  );
};

export default Slider;
