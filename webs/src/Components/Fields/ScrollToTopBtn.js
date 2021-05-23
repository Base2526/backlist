import React, { useEffect } from "react";

const ScrollToTopBtn = (props) => {
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    document.addEventListener("scroll", function (e) {
      toggleVisibility();
    });
  });

  const toggleVisibility = () => {
    if (window.pageYOffset > 350) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="scroll-to-top">
      {visible && (
        <div onClick={() => scrollToTop()}>
          <span>^</span>
        </div>
      )}
    </div>
  );
};

export default ScrollToTopBtn;
