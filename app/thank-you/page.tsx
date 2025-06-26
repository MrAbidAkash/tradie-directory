// app/partner/signup/thank-you/page.tsx
"use client";

import { Result, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default function ThankYou() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: "24px",
      }}
    >
      <Result
        icon={<SmileOutlined />}
        title="Thanks for signing up!"
        subTitle="We’ll review your information and send your login details soon."
        extra={
          <Button type="primary" href="/">
            Go to Homepage
          </Button>
        }
      />
    </div>
  );
}
