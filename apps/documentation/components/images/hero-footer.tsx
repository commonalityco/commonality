import React from 'react';

function HeroFooter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 504 147"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_530_271)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M252 145L1.00002 0L1 145H252ZM252 145H503V0L252 145Z"
          className="fill-interactive"
        />
        <path
          d="M252.008 144.418L502.802 -0.465836"
          stroke="url(#paint0_linear_530_271)"
          stroke-linecap="round"
        />
        <path
          d="M252 144.418L1.20615 -0.465836"
          stroke="url(#paint1_linear_530_271)"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_530_271"
          x1="252.003"
          y1="144.581"
          x2="501.29"
          y2="-0.414757"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="currentColor" />
          <stop offset="1" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_530_271"
          x1="252.005"
          y1="144.581"
          x2="2.71789"
          y2="-0.414757"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="currentColor" />
          <stop offset="1" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
        <clipPath id="clip0_530_271">
          <rect width="504" height="147" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default HeroFooter;
