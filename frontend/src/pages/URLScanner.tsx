
import { Scanner } from "@/components/Scanner";
import { LinkIcon } from "lucide-react";

const URLScanner = () => {
  return (
    <Scanner
      title="URL Scanner"
      description="Check if a website or URL contains malicious content, phishing attempts, or security vulnerabilities."
      icon={<LinkIcon size={32} />}
      placeholder="Enter URL (e.g., https://example.com)"
      scanType="url"
    />
  );
};

export default URLScanner;
