import { useEffect } from "react";

const Cursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor");
    const follower = document.querySelector(".cursor-follower");

    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      if (cursor) {
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;
      }
      if (follower) {
        follower.style.left = `${clientX}px`;
        follower.style.top = `${clientY}px`;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="cursor-follower"></div>
    </>
  );
};

export default Cursor;
