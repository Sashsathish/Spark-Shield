
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { loaderCharAnimation, loaderTextAnimation } from "@/lib/animations";

export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const loadingText = "SparkShield Security System";
  
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    const securityLogs = [
      "Initializing security protocols...",
      "Loading threat detection algorithms...",
      "Establishing secure connection...",
      "Scanning system integrity...",
      "Loading AI defense system...",
      "Preparing shield matrix...",
      "Calibrating threat sensors...",
      "Synchronizing security database...",
      "Activating real-time protection...",
    ];

    let currentIndex = 0;
    const messageInterval = setInterval(() => {
      if (currentIndex < securityLogs.length) {
        setMessages((prev) => [...prev, securityLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-spark-dark flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 matrix-bg animate-matrix opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: 0.3, 
              duration: 0.5,
              ease: "easeOut" 
            }
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-shield-gradient animate-pulse-ring rounded-full"></div>
          <div className="relative w-28 h-28 flex items-center justify-center bg-spark-dark-600 rounded-full border-2 border-spark-blue shadow-neon-blue overflow-hidden">
            <ShieldCheck size={50} className="text-spark-blue animate-pulse" />
            <div className="absolute inset-0 scanning-line"></div>
          </div>
        </motion.div>

        <motion.div 
          variants={loaderTextAnimation}
          initial="hidden"
          animate="visible"
          className="mb-8 text-center"
        >
          <div className="flex justify-center mb-2">
            {loadingText.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={loaderCharAnimation}
                className={`text-2xl sm:text-3xl font-bold ${
                  index < 5 ? "text-spark-blue" : "text-white"
                }`}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.5 }}
            className="text-spark-gray-200 text-sm"
          >
            Advanced threat detection & protection
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, width: "100%" }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs mb-8"
        >
          <div className="h-1 w-full bg-spark-dark-500 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-spark-blue to-spark-cyan"
            ></motion.div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-spark-gray-300">
            <span>Loading security modules</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-xs h-28 overflow-hidden text-xs text-spark-gray-300"
        >
          <div className="h-full flex flex-col-reverse space-y-reverse space-y-1 overflow-hidden">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono"
              >
                &gt; {message}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
