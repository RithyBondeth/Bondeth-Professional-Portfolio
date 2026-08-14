const PIXEL_B_PATH =
  "M0 0H144V18H176V44H200V108H176V134H144V144H176V166H200V230H176V256H144V274H0V0ZM44 42V108H132V92H156V58H132V42H44ZM44 166V232H132V216H156V182H132V166H44ZM176 24H200V44H176V24Z";

export function PixelBOg({
  size = 64,
  inverse = false,
}: {
  size?: number;
  inverse?: boolean;
}) {
  return (
    <svg
      width={(size * 200) / 274}
      height={size}
      viewBox="0 0 200 274"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={PIXEL_B_PATH}
        fill={inverse ? "#FAF9F5" : "#141413"}
        fillRule="evenodd"
      />
      <rect x="176" width="24" height="24" fill="#D97757" />
    </svg>
  );
}
