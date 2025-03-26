
import { Scanner } from "@/components/Scanner";
import { Layout } from "@/components/Layout";
import { ScreenShareOff } from "lucide-react";

const PhishingDetector = () => {
  return (
    <Scanner
      title="Phishing Detector"
      description="Upload a screenshot of a suspicious website for our AI to analyze and detect potential phishing patterns."
      icon={<ScreenShareOff size={32} />}
      placeholder="Drop a screenshot here or click to browse"
      scanType="phishing"
    />
  );
};

export default PhishingDetector;
