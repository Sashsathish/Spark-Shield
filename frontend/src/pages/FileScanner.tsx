
import { Scanner } from "@/components/Scanner";
import { Layout } from "@/components/Layout";
import { FileSearch } from "lucide-react";

const FileScanner = () => {
  return (
    <Layout>
      <Scanner
        title="File Scanner"
        description="Upload and scan files for malware, viruses, and other security threats using our advanced detection system."
        icon={<FileSearch size={32} />}
        placeholder="Upload a file to scan"
        scanType="file"
      />
    </Layout>
  );
};

export default FileScanner;
