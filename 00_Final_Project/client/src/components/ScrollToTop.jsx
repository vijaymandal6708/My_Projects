import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll to top normally
    window.scrollTo(0, 0);

    // trigger page animation
    document.body.classList.remove("page-enter");
    void document.body.offsetWidth; // reflow
    document.body.classList.add("page-enter");
  }, [pathname]);

  return null;
};

export default ScrollToTop;
