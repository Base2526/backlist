import React, { useEffect, useState } from "react";

import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const ScrollToTopBtn = (props) => {
  const [visible, setVisible] = useState();

  useEffect(() => {
    document.addEventListener("scroll", function (e) {
      toggleVisibility();
    });

    setVisible(false)

    return () => {
      setVisible() 
    };
  }, []);

  const toggleVisibility = () => {
    if (window.pageYOffset > 800) {
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
      { visible && 
        <div onClick={() => scrollToTop()}><span><ExpandLessIcon /></span></div>
      }
    </div>
  );
};

export default ScrollToTopBtn;
