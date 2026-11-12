"use client";

import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  children,
  eyebrowClassName,
  titleClassName,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  eyebrowClassName?: string;
  titleClassName?: string;
}) {
  return (
    <div>
      <p className={eyebrowClassName ?? "eyebrow text-[#91A88F]"}>
        {eyebrow}
      </p>
      <h1
        className={
          titleClassName ??
          "font-display font-semibold tracking-tight mt-2 text-3xl text-[#DCE5DD] md:text-4xl"
        }
      >
        {title}
      </h1>
      {children ? <div>{children}</div> : null}
    </div>
  );
}
