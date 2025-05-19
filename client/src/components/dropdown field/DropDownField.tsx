import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropDownFieldProps } from "../../models/subs/Dropdown";

const DropDownField: React.FC<DropDownFieldProps> = ({
  options,
  selected,
  label,
  onChange,
  disabled,
  small,
  className,
  menuPosition = "bottom",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className} ${small && !className ? "max-w-[120px]" : !className  ?"max-w-[250px]":""}`}>
      {/* Dropdown Trigger */}
      <div
        className={`
          flex items-center justify-between 
          px-3 py-2 
          border rounded-lg 
          cursor-pointer 
          bg-white dark:bg-gray-800 
          border-gray-300 dark:border-gray-600
          shadow-sm
          transition-all duration-200 ease-in-out
          ${disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
          }
          ${small ? "text-sm px-2 py-1" : "text-base"}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate dark:text-white flex-1">
          {selected ? options.find((opt) => opt.value === selected)?.label : label}
        </span>
        <ChevronDown 
          className={`
            ml-2  
            transition-transform duration-300 ease-in-out
            ${isOpen ? "rotate-180" : "rotate-0"}
            ${small ? "w-4 h-4" : "w-5 h-5"}
            text-gray-500 dark:text-gray-300
          `} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className={`
            absolute z-20 
            w-full 
            border rounded-lg 
            shadow-xl 
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600
            overflow-hidden
            ${menuPosition === "top" 
              ? "bottom-full mb-2" 
              : "top-full mt-2"
            }
            max-h-60 overflow-y-auto
          `}
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`
                px-3 py-2 
                cursor-pointer 
                transition-all duration-150 ease-in-out
                ${
                  option.value === selected 
                    ? "bg-blue-500 text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                }
                ${small ? "text-sm px-2 py-1" : "text-base"}
                first:rounded-t-lg 
                last:rounded-b-lg
              `}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDownField;
