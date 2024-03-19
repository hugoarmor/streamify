type Props = {
  onClick?: () => void;
  className?: string;
}

export function CloseIcon(props: Props) {
  return (
    <svg
      className={props.className}
      onClick={props.onClick}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="#ECECEC"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
