import { Popover as PopoverMUI } from "@mui/material";
import React, { JSXElementConstructor, ReactElement, useState } from "react";

type Props = {
  children?: React.ReactNode;
  anchorElement: ReactElement<any, string | JSXElementConstructor<any>>;
};

export function Popover({ anchorElement, children }: Props) {
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      {React.cloneElement(anchorElement, { onClick: handlePopoverClick })}
      <PopoverMUI
        id={popoverId}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {children}
      </PopoverMUI>
    </>
  );
}
