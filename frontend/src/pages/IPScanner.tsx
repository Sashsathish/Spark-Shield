
import { Scanner } from "@/components/Scanner";
import { Layout } from "@/components/Layout";
import { Server } from "lucide-react";

const IPScanner = () => {
  return (
    <Layout>
      <Scanner
        title="IP Scanner"
        description="Check IP addresses for potential threats, reputation issues, and blacklist status."
        icon={<Server size={32} />}
        placeholder="Enter IP address (e.g., 192.168.1.1)"
        scanType="ip"
      />
    </Layout>
  );
};

export default IPScanner;
