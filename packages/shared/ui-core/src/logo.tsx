import React from 'react';

export function Logo(properties: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...properties}
    >
      <g clipPath="url(#clip0_412_23)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.7294 4.37464C21.047 4.77185 20.5792 5.28719 20.1033 5.10782C18.8272 4.62686 17.4443 4.36372 16 4.36372C9.57342 4.36372 4.36364 9.57349 4.36364 16.0001C4.36364 17.4443 4.62676 18.8271 5.10768 20.1032C5.28704 20.5791 4.77169 21.0469 4.37449 20.7292C1.70802 18.5969 0 15.3161 0 11.6364C0 5.20978 5.20978 0 11.6364 0C15.3162 0 18.597 1.70808 20.7294 4.37464Z"
          fill="currentColor"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 27.6365C22.4266 27.6365 27.6364 22.4267 27.6364 16.0001C27.6364 14.5559 27.3733 13.1731 26.8923 11.897C26.713 11.4211 27.2283 10.9533 27.6255 11.271C30.292 13.4033 32 16.6841 32 20.3638C32 26.7904 26.7902 32.0002 20.3637 32.0002C16.6838 32.0002 13.403 30.2921 11.2707 27.6256C10.953 27.2284 11.4208 26.713 11.8967 26.8924C13.1728 27.3733 14.5557 27.6365 16 27.6365Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_412_23">
          <rect width="32" height="32" fill="transparent" />
        </clipPath>
      </defs>
    </svg>
  );
}
