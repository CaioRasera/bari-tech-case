import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel de Tarefas — Banco Bari",
  description:
    "Painel de gerenciamento de tarefas operacionais — Teste Técnico Frontend Banco Bari",
};

import { theme as antTheme } from "antd";

const theme = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: "#1E90FF",
    colorBgBase: "#0B192C",
    colorBgContainer: "#0F213A",
    colorBgElevated: "#0F213A",
    colorBorder: "rgba(30, 144, 255, 0.2)",
    colorTextBase: "#E2E8F0",
    borderRadius: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    controlItemBgActive: "rgba(30, 144, 255, 0.2)",
    controlItemBgHover: "rgba(255, 255, 255, 0.08)",
  },
  components: {
    Input: {
      activeBorderColor: "#1E90FF",
      hoverBorderColor: "#1E90FF",
      colorBgContainer: "#0B192C",
    },
    Select: {
      activeBorderColor: "#1E90FF",
      hoverBorderColor: "#1E90FF",
      colorBgContainer: "#0B192C",
      optionSelectedBg: "rgba(30, 144, 255, 0.2)",
      optionActiveBg: "rgba(255, 255, 255, 0.08)",
    },
    DatePicker: {
      activeBorderColor: "#1E90FF",
      hoverBorderColor: "#1E90FF",
      colorBgContainer: "#0B192C",
    },
    Button: {
      primaryColor: "#0B192C",
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme} locale={ptBR}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
