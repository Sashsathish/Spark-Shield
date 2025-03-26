
import { Scanner } from "@/components/Scanner";
import { FileSearch } from "lucide-react";

const FileScanner = () => {
  return (
    <Scanner
      title="File Scanner"
      description="Upload and scan files for malware, viruses, and other security threats using our advanced detection system."
      icon={<FileSearch size={32} />}
      placeholder="Upload a file to scan"
      scanType="file"
    />
  );
};

export default FileScanner;
