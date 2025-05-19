export interface DropDownFieldProps {
  label?: string;
  options: OptionProps[];
  selected?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  small? : boolean;
  className?: string;
  menuPosition?:"top" | "bottom";
}

export interface OptionProps{
    label: string; value: string
}