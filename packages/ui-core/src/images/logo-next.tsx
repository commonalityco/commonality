import React from 'react';
export function LogoNext(properties: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...properties}
    >
      <g clipPath="url(#clip0_569_471)">
        <g clipPath="url(#clip1_569_471)">
          <mask
            id="mask0_569_471"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <path
              d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
              fill="black"
            />
          </mask>
          <g mask="url(#mask0_569_471)">
            <path
              d="M12 23.5999C18.4065 23.5999 23.6 18.4064 23.6 11.9999C23.6 5.5934 18.4065 0.399902 12 0.399902C5.59352 0.399902 0.400024 5.5934 0.400024 11.9999C0.400024 18.4064 5.59352 23.5999 12 23.5999Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0.8C5.81441 0.8 0.8 5.81441 0.8 12C0.8 18.1856 5.81441 23.2 12 23.2C18.1856 23.2 23.2 18.1856 23.2 12C23.2 5.81441 18.1856 0.8 12 0.8ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
              fill="white"
            />
            <path
              d="M19.9344 21.0026L9.21895 7.19995H7.20001V16.796H8.81516V9.2511L18.6665 21.9793C19.1111 21.6818 19.5345 21.3553 19.9344 21.0026Z"
              fill="url(#paint0_linear_569_471)"
            />
            <path
              d="M16.9333 7.19995H15.3333V16.8H16.9333V7.19995Z"
              fill="url(#paint1_linear_569_471)"
            />
          </g>
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_569_471"
          x1="14.5333"
          y1="15.5333"
          x2="19.2667"
          y2="21.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_569_471"
          x1="16.1333"
          y1="7.19995"
          x2="16.1065"
          y2="14.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_569_471">
          <rect width="24" height="24" fill="white" />
        </clipPath>
        <clipPath id="clip1_569_471">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
