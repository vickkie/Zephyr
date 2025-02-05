import React, { useState } from "react";
import { Link } from "react-router-dom"; // Optional, for navigation

const FloatingButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="floating-button-container">
      <button onClick={toggleMenu} className="floating-button">
        ☰ {/* You can use an icon here */}
      </button>

      {isMenuOpen && (
        <div className="menu">
          <ul>
            <li>
              <Link to="/page1">Page 1</Link> {/* Link to your pages */}
            </li>
            <li>
              <Link to="/page2">Page 2</Link>
            </li>
            <li>
              <Link to="/page3">Page 3</Link>
            </li>
            {/* Add more items as needed */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FloatingButton;
