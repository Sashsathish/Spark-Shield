
import { Scanner } from "@/components/Scanner";
import { Zap } from "lucide-react";

const CodeRepair = () => {
  return (
    <Scanner
      title="Code Repair"
      description="Enter a GitHub repository URL to scan for security vulnerabilities, malware injections, and get AI-powered suggestions for repairs."
      icon={<Zap size={32} />}
      placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
      scanType="code"
    />
  );
};

export default CodeRepair;
