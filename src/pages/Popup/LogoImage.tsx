import React, { FC } from 'react';

const LogoImage: FC<{}> = () => {
  return (
    <svg
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="3.75861"
        width="16.6667"
        height="16.3218"
        rx="0.804598"
        fill="url(#paint0_linear_22_8)"
        stroke="black"
        stroke-width="1.14943"
      />
      <g filter="url(#filter0_ddd_22_8)">
        <path
          d="M4.33333 1.8046C4.33333 1.36023 4.69356 1 5.13793 1H20.1954C20.6398 1 21 1.36023 21 1.8046V16.5172C21 16.9616 20.6398 17.3218 20.1954 17.3218H5.13793C4.69356 17.3218 4.33333 16.9616 4.33333 16.5172V1.8046Z"
          fill="white"
        />
        <path
          d="M4.33333 1.8046C4.33333 1.36023 4.69356 1 5.13793 1H20.1954C20.6398 1 21 1.36023 21 1.8046V16.5172C21 16.9616 20.6398 17.3218 20.1954 17.3218H5.13793C4.69356 17.3218 4.33333 16.9616 4.33333 16.5172V1.8046Z"
          stroke="black"
          stroke-width="1.14943"
        />
      </g>
      <path
        d="M13.6688 5.98205H13.7604L14.1483 9.17709H11.9124L13.6688 5.98205ZM14.4716 12.2644H15.8779L14.7949 4.48959H13.2701L8.80352 12.2644H10.2636L11.352 10.2762H14.2346L14.4716 12.2644Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_ddd_22_8"
          x="3.29885"
          y="0.425293"
          width="18.7356"
          height="18.3908"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.45977" />
          <feGaussianBlur stdDeviation="0.229885" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_22_8"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.45977" />
          <feGaussianBlur stdDeviation="0.229885" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_22_8"
            result="effect2_dropShadow_22_8"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.45977" />
          <feGaussianBlur stdDeviation="0.229885" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_22_8"
            result="effect3_dropShadow_22_8"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect3_dropShadow_22_8"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_22_8"
          x1="9.33333"
          y1="3.75861"
          x2="9.33333"
          y2="20.0804"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.317708" stop-color="#FCB48C" stop-opacity="0.78" />
          <stop offset="1" stop-color="#DF6CCD" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LogoImage;
