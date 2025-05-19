import { useState, MouseEvent, ReactNode } from "react";
import "./SubmitButton.css"; //Import the CSS file

interface SubmitButtonProps {
  children?: ReactNode; //Accepts any React element (text, icons, images, etc.)
  onClick?: () => void;
}

interface Ripple {
  id: number;
  size: number;
  x: number;
  y: number;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, onClick }) => {
  const [ripple, setRipple] = useState<Ripple[]>([]);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now(),
      size,
      x,
      y,
    };

    setRipple((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipple((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button className="submit-btn" onClick={(e) => { createRipple(e); onClick && onClick(); }}>
      <span className="content">{children}</span>
      <span className="ripple-container">
        {ripple.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{
              width: r.size,
              height: r.size,
              top: r.y,
              left: r.x,
            }}
          />
        ))}
      </span>
    </button>
  );
};

export default SubmitButton;
