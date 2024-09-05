import React, { forwardRef } from "react";

import { Input } from "@/components/ui/input";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
}

const AmountInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  return <Input type="number" onKeyDownCapture={onKeyDown} {...props} />;
});

AmountInput.displayName = "AmountInput";

export default AmountInput;
