
import { Scanner } from "@/components/Scanner";
import { Layout } from "@/components/Layout";
import { Globe } from "lucide-react";

const DomainScanner = () => {
  return (
    <Layout>
      <Scanner
        title="Domain Scanner"
        description="Analyze domain names for security risks, reputation issues, and possible malicious activities."
        icon={<Globe size={32} />}
        placeholder="Enter domain name (e.g., example.com)"
        scanType="domain"
      />
    </Layout>
  );
};

export default DomainScanner;
