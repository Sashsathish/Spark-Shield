
import { motion } from "framer-motion";
import { staggerContainer, cardAnimation } from "@/lib/animations";
import { 
  ShieldCheck, 
  FileSearch, 
  Globe, 
  LinkIcon, 
  Server, 
  AlertTriangle,
  ShieldAlert, 
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const scanModules = [
    {
      title: "File Scanner",
      description: "Scan files for malware & threats",
      icon: <FileSearch size={24} />,
      color: "text-spark-blue",
      link: "/file-scanner"
    },
    {
      title: "URL Scanner",
      description: "Check URLs for malicious content",
      icon: <LinkIcon size={24} />,
      color: "text-spark-cyan",
      link: "/url-scanner"
    },
    {
      title: "Domain Scanner",
      description: "Analyze domains for security risks",
      icon: <Globe size={24} />,
      color: "text-spark-green",
      link: "/domain-scanner"
    },
    {
      title: "IP Scanner",
      description: "Evaluate IP addresses for threats",
      icon: <Server size={24} />,
      color: "text-spark-yellow",
      link: "/ip-scanner"
    }
  ];

  const recentScans = [
    {
      type: "File",
      name: "invoice_april.pdf",
      result: "Clean",
      timestamp: "2 minutes ago",
      status: "clean"
    },
    {
      type: "URL",
      name: "https://example-secure.com",
      result: "Clean",
      timestamp: "15 minutes ago",
      status: "clean"
    },
    {
      type: "Domain",
      name: "suspicious-domain.com",
      result: "Suspicious",
      timestamp: "1 hour ago",
      status: "suspicious"
    }
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
        <p className="text-spark-gray-300">
          Monitor and protect your digital assets with advanced threat detection
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-5 rounded-xl col-span-2"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-spark-blue/10">
              <ShieldCheck size={24} className="text-spark-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Shield Status</h2>
              <p className="text-spark-gray-300 text-sm">Real-time protection active</p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-spark-green/10 text-spark-green text-xs font-medium rounded-full border border-spark-green/20">
                Protected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-spark-dark-700/80 rounded-lg p-3">
              <div className="text-spark-gray-300 text-xs mb-1">Files Scanned</div>
              <div className="text-xl font-semibold">24</div>
            </div>
            <div className="bg-spark-dark-700/80 rounded-lg p-3">
              <div className="text-spark-gray-300 text-xs mb-1">URLs Checked</div>
              <div className="text-xl font-semibold">17</div>
            </div>
            <div className="bg-spark-dark-700/80 rounded-lg p-3">
              <div className="text-spark-gray-300 text-xs mb-1">Threats Detected</div>
              <div className="text-xl font-semibold text-spark-red">3</div>
            </div>
            <div className="bg-spark-dark-700/80 rounded-lg p-3">
              <div className="text-spark-gray-300 text-xs mb-1">Last Scan</div>
              <div className="text-sm font-semibold">2 mins ago</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-5 rounded-xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-spark-red/10">
              <ShieldAlert size={20} className="text-spark-red" />
            </div>
            <h2 className="text-lg font-semibold">Threat Summary</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-spark-gray-300">Malware</span>
                <span className="text-xs">1</span>
              </div>
              <div className="w-full h-1.5 bg-spark-dark-500 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "20%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-spark-red"
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-spark-gray-300">Phishing</span>
                <span className="text-xs">2</span>
              </div>
              <div className="w-full h-1.5 bg-spark-dark-500 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-spark-yellow"
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-spark-gray-300">Suspicious</span>
                <span className="text-xs">5</span>
              </div>
              <div className="w-full h-1.5 bg-spark-dark-500 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-spark-blue"
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-spark-dark-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Activity size={16} className="text-spark-gray-300 mr-2" />
                <span className="text-sm">System status</span>
              </div>
              <span className="text-xs px-2 py-0.5 bg-spark-green/10 text-spark-green rounded-full">Healthy</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Scan Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {scanModules.map((module, index) => (
            <motion.div
              key={module.title}
              variants={cardAnimation}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl p-5 hover:shadow-neon-blue transition-all duration-300 cursor-pointer"
            >
              <Link to={module.link} className="block h-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-spark-dark-500 mb-4 ${module.color}`}>
                  {module.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                <p className="text-sm text-spark-gray-300">{module.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-spark-dark-500">
                  <th className="text-left py-3 px-4 text-sm font-medium text-spark-gray-200">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-spark-gray-200">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-spark-gray-200">Result</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-spark-gray-200">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan, index) => (
                  <tr key={index} className="border-b border-spark-dark-500 last:border-0">
                    <td className="py-3 px-4 text-sm">{scan.type}</td>
                    <td className="py-3 px-4 text-sm font-mono text-spark-gray-200 truncate max-w-[200px]">
                      {scan.name}
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          scan.status === "clean" 
                            ? "bg-spark-green/10 text-spark-green" 
                            : scan.status === "suspicious" 
                              ? "bg-spark-yellow/10 text-spark-yellow" 
                              : "bg-spark-red/10 text-spark-red"
                        }`}
                      >
                        {scan.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-spark-gray-300">{scan.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
