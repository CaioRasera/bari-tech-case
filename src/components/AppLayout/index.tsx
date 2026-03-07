"use client";

import React from "react";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}

export default function AppLayout({
  children,
  title,
  subtitle,
  extra,
}: AppLayoutProps) {
  return (
    <div className={styles.layoutWrapper}>
      <header className={styles.layoutHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {extra && <div className={styles.extraSection}>{extra}</div>}
        </div>
      </header>
      <main className={styles.layoutMain}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
}
