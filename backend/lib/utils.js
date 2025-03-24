import * as fs from "fs";
import crypto from "crypto";

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// 🛠️ Utility: Get All Files in a Repo
export function getAllFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = `${dir}/${file}`;
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

// 🛠️ Utility: Analyze a Script File
export async function analyzeFile(filePath) {
  try {
    console.log(`Analyzing file: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf-8");
    console.log("File content loaded successfully");

    // 🛡️ Static Analysis
    const staticCheck = staticAnalysis(content);
    if (staticCheck.malicious) {
      return {
        file: filePath,
        status: "❌ Unsafe",
        reason: staticCheck.reason,
      };
    }

    // 🛡️ Hash Check
    const fileHash = crypto.createHash("sha256").update(content).digest("hex");
    console.log(`File hash: ${fileHash}`);

    // 🛡️ Behavior Analysis
    const behaviorCheck = await behaviorAnalysis(filePath);
    if (behaviorCheck.malicious) {
      return {
        file: filePath,
        status: "❌ Unsafe",
        reason: behaviorCheck.reason,
      };
    }

    return { file: filePath, status: "✅ Safe" };
  } catch (error) {
    console.error(`Error analyzing file: ${error.message}`);
    return {
      file: filePath,
      status: "❌ Error",
      reason: "Failed to analyze file: " + error.message,
    };
  }
}

// 🛠️ GitHub Trust Verification
export async function checkGitHubRepo(repoUrl) {
  console.log("Starting GitHub trust check for:", repoUrl);
  try {
    const apiUrl = repoUrl
      .replace(/https:\/\/github\.com\//, "https://api.github.com/repos/")
      .replace(/\.git$/, "");

    console.log("Fetching from:", apiUrl);

    // Prepare headers - will work with or without token
    const headers = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      console.log("Using GitHub token for authentication");
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    } else {
      console.log(
        "No GitHub token found - proceeding with unauthenticated request (rate limits apply)"
      );
    }

    const response = await axios.get(apiUrl, {
      headers,
      timeout: 10000, // 10 seconds timeout
    });

    console.log("GitHub API Response Status:", response.status);

    if (response.data && response.data.owner) {
      return `Trusted Owner: ${response.data.owner.login}`;
    } else {
      console.log("Repository owner information not found");
      return "⚠️ Unverified Repository";
    }
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("GitHub API request timed out");
      return "⚠️ Repository verification timed out";
    }

    console.error("GitHub API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response?.status === 403) {
      return "⚠️ GitHub API rate limit exceeded";
    } else if (error.response?.status === 404) {
      return "⚠️ Repository not found";
    } else {
      return "⚠️ Unable to verify repository";
    }
  }
}

// Improved static code analysis with more comprehensive patterns
function staticAnalysis(content) {
  const patterns = [
    { regex: /exec\(['"`][^)]*rm /i, description: "Destructive exec command" },
    {
      regex: /eval\(['"`][^)]*fetch/i,
      description: "eval with network access",
    },
    {
      regex: /subprocess\.call\(['"`][^)]*rm /i,
      description: "Destructive subprocess",
    },
    {
      regex: /os\.system\(['"`][^)]*rm -rf/i,
      description: "Destructive os.system",
    },
    { regex: /wget[^&|;]*\|\s*bash/i, description: "wget piped to bash" },
    { regex: /curl[^&|;]*\|\s*bash/i, description: "curl piped to bash" },
    {
      regex: /base64 -d [^&|;]*\|\s*bash/i,
      description: "base64 decode to bash",
    },
    {
      regex: /\/dev\/tcp\/[^&|;]*\|/i,
      description: "/dev/tcp/ pipe (reverse shell)",
    },
    {
      regex: /nc\s+-e\s+\/bin\/[bash|sh]/i,
      description: "netcat execution shell",
    },
    {
      regex: /mkfifo\s+.*\|\s*nc/i,
      description: "netcat pipe (reverse shell)",
    },
    // Added patterns to catch more variants
    {
      regex: /python\s+-c\s+['"]import\s+(os|socket|subprocess|pty)/i,
      description: "Python one-liner for shell access",
    },
    {
      regex: /bash\s+-i\s+>[\s&]+\/dev\/tcp\//i,
      description: "Bash reverse shell",
    },
    {
      regex:
        /\.connect\s*\(\s*\(["']\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}["']\s*,\s*\d+\s*\)\s*\)/i,
      description: "Connection to remote IP (potential C2)",
    },
    {
      regex: /import\s+socket.*\.connect\(/i,
      description: "Python socket connection",
    },
    {
      regex:
        /(?:axios|fetch|http\.get)\(['"]https?:\/\/[^'"]+\/[^'"]*\.(?:sh|py|exe|bin)['"]\)/i,
      description: "Download of executable content",
    },
  ];

  for (let pattern of patterns) {
    if (pattern.regex.test(content)) {
      return {
        malicious: true,
        reason: `Malicious pattern detected: ${pattern.description}`,
      };
    }
  }

  return { malicious: false };
}

// Enhanced behavior analysis
async function behaviorAnalysis(filePath) {
  try {
    const fileExt = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, "utf-8");
    const fileName = path.basename(filePath).toLowerCase();
    console.log(`Performing behavior analysis on ${fileExt} file: ${fileName}`);

    // Special case for package.json - consider it safe if it doesn't have malicious scripts
    if (fileName === "package.json") {
      return checkPackageJson(content);
    }

    // Run generic checks for all files first
    const genericCheck = checkGenericMaliciousPatterns(content);
    if (genericCheck.malicious) {
      return genericCheck;
    }

    // 1. For JavaScript files, use a VM sandbox and check for malicious patterns
    if (fileExt === ".js") {
      return analyzeJavaScript(content, filePath);
    }

    // 2. For Python files, analyze imports and dangerous patterns
    if (fileExt === ".py") {
      return analyzePythonFile(content);
    }

    // 3. For shell scripts
    if (fileExt === ".sh" || fileExt === ".bash") {
      return analyzeShellScript(content);
    }

    // Check for scripts with wrong extensions
    if (content.includes("#!/bin/bash") || content.includes("#!/bin/sh")) {
      return analyzeShellScript(content);
    }

    if (
      content.includes("#!/usr/bin/env python") ||
      content.includes("#!/usr/bin/python")
    ) {
      return analyzePythonFile(content);
    }

    return { malicious: false };
  } catch (error) {
    console.error(`Error in behavior analysis: ${error.message}`);
    return {
      malicious: false,
      reason: `Error during behavior analysis: ${error.message}`,
    };
  }
}

// More stringent generic malicious pattern checking
function checkGenericMaliciousPatterns(content) {
  // Highly malicious patterns that would be dangerous in any context
  const highlyMaliciousPatterns = [
    {
      pattern: /rm\s+-rf\s+\/(?!\s|$)/,
      reason: "Attempts to delete root filesystem",
    },
    {
      pattern: /mkfifo\s+.*\|\s*nc\s+.*\s+[0-9]+/,
      reason: "Creates a reverse shell using named pipe and netcat",
    },
    {
      pattern: /\/dev\/tcp\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\/[0-9]+/,
      reason: "Direct network socket connection (possible reverse shell)",
    },
    {
      pattern: /curl\s+.*\|\s*(?:bash|sh)/,
      reason: "Downloads and executes content from the internet",
    },
    {
      pattern: /wget\s+.*\-O\s+.*\|\s*(?:bash|sh)/,
      reason: "Downloads and executes content from the internet",
    },
    {
      pattern: /base64\s+\-d[^|]*\|\s*(?:bash|sh)/,
      reason: "Decodes and executes base64 content",
    },
    {
      pattern: /nohup\s+.*&\s*$/,
      reason: "Executes command in background, possibly for persistence",
    },
    {
      pattern: /nc\s+(?:-[el]|--exec)\s+/,
      reason: "Netcat being used to execute commands",
    },
    {
      pattern: /bash\s+-i/,
      reason: "Invokes interactive bash shell (often used in reverse shells)",
    },
    {
      pattern:
        /telnet\s+[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\s+[0-9]+\s+\|\s*\/bin\/(?:bash|sh)/,
      reason: "Telnet piped to shell",
    },
  ];

  for (const { pattern, reason } of highlyMaliciousPatterns) {
    if (pattern.test(content)) {
      return {
        malicious: true,
        reason,
      };
    }
  }

  // Check for suspicious combinations that might indicate malicious intent
  if (
    (content.includes("socket") || content.includes("net.Socket")) &&
    (content.includes("spawn") ||
      content.includes("exec") ||
      content.includes("fork"))
  ) {
    return {
      malicious: true,
      reason:
        "Network socket combined with process execution (possible reverse shell)",
    };
  }

  // Check for process monitoring or manipulation
  if (
    (content.includes("/proc/") && content.includes("readFile")) ||
    (content.includes("process.kill") && content.includes("setInterval"))
  ) {
    return {
      malicious: true,
      reason: "Process monitoring or manipulation detected",
    };
  }

  return { malicious: false };
}

// Analyze JavaScript files - improved detection
function analyzeJavaScript(content, filePath) {
  // First, check for highly dangerous patterns
  const dangerousPatterns = [
    {
      pattern: /child_process[^\n;]*exec\s*\(\s*['"`][^'"`]*rm\s+-rf/i,
      reason: "Destructive command execution",
    },
    {
      pattern:
        /child_process[^\n;]*spawn\s*\(\s*['"`](?:bash|sh)['"`][^\)]*\[['"`]-c['"`],\s*['"`][^'"`]*\/dev\/tcp/i,
      reason: "Spawns a reverse shell",
    },
    {
      pattern:
        /net\.[^\n;]*connect\s*\(\s*[0-9]+\s*,\s*['"`][0-9]+\.[0-9]+\.[0-9]+\.[0-9]+['"`][^\)]*\)\s*;\s*child_process/i,
      reason: "Creates network connection and spawns process (reverse shell)",
    },
    {
      pattern: /fs\.[^\n;]*writeFileSync\s*\(\s*['"`][^\n]*\/\.bashrc/i,
      reason: "Modifies bash startup file (persistence)",
    },
    {
      pattern:
        /download[^\n;]*malware|inject[^\n;]*backdoor|install[^\n;]*keylogger/i,
      reason: "Suspicious function or variable names",
    },
    // Added more dangerous patterns
    {
      pattern: /process\.spawn|spawn\s*\(/i,
      reason: "Process spawning (potential for command execution)",
    },
    {
      pattern:
        /require\(['"](child_process|crypto|fs|net|http|https|path|os)['"]\)/i,
      reason: "Imports potentially dangerous Node.js modules",
    },
    {
      pattern: /socket\.[^\n;]*connect\s*\(/i,
      reason: "Creates network socket connection",
    },
  ];

  for (const { pattern, reason } of dangerousPatterns) {
    if (pattern.test(content)) {
      return {
        malicious: true,
        reason,
      };
    }
  }

  // If we have a server file but it looks suspicious
  if (
    filePath.includes("server.js") ||
    content.includes("createServer") ||
    content.includes("listen(") ||
    content.includes("express()")
  ) {
    // Don't automatically trust server code now
    if (hasServerSuspiciousActivity(content)) {
      return {
        malicious: true,
        reason: "Server code with suspicious activity detected",
      };
    }
  }

  // Check for cryptocurrency mining patterns
  if (/new\s+CoinHive|cryptonight|mineCrypto|blockchain\.mine/i.test(content)) {
    return {
      malicious: true,
      reason: "Cryptocurrency mining code detected",
    };
  }

  // More specific check for eval on downloaded content
  if (
    /eval\s*\(\s*(?:response|data|body|res\.text\(\)|await fetch)/i.test(
      content
    )
  ) {
    return {
      malicious: true,
      reason: "Evaluates downloaded content (remote code execution)",
    };
  }

  return { malicious: false };
}

// Check if server code has suspicious behavior
function hasServerSuspiciousActivity(content) {
  const suspiciousActivities = [
    // Command execution from user input
    /exec\s*\(\s*req\.(?:body|params|query)/i,
    // Eval of user input
    /eval\s*\(\s*req\.(?:body|params|query)/i,
    // File operations based on user input
    /(?:writeFile|appendFile|readFile)\s*\(\s*(?:req\.(?:body|params|query)|path\.join\([^)]*req\.(?:body|params|query))/i,
    // Direct inclusion of user controlled paths
    /require\s*\(\s*(?:req\.(?:body|params|query)|path\.join\([^)]*req\.(?:body|params|query))/i,
    // Shell=true in spawn/exec
    /(?:spawn|exec)\s*\([^,]*,\s*\{[^}]*shell\s*:\s*true/i,
  ];

  for (const pattern of suspiciousActivities) {
    if (pattern.test(content)) {
      return true;
    }
  }

  return false;
}

// Analyze Python files with improved detection
function analyzePythonFile(content) {
  // Check for dangerous Python patterns
  const dangerousPythonPatterns = [
    {
      pattern:
        /import\s+subprocess[\s\S]*subprocess\.(?:call|run|Popen)\s*\(\s*(?:['"`]|\[['"`])(?:rm|chmod|wget|curl)/i,
      reason: "Python executes potentially dangerous system commands",
    },
    {
      pattern:
        /import\s+os[\s\S]*os\.system\s*\(\s*['"`](?:rm|chmod|wget|curl)/i,
      reason: "Python executes potentially dangerous system commands",
    },
    {
      pattern:
        /import\s+socket[\s\S]*socket\.socket\s*\([^)]*\)[\s\S]*\.connect\s*\(\s*\((['"`][0-9]+\.[0-9]+\.[0-9]+\.[0-9]+['"`])/i,
      reason:
        "Python creates outbound network connection (possible reverse shell)",
    },
    {
      pattern: /exec\s*\(\s*base64\.b64decode\s*\(/i,
      reason: "Python executes decoded base64 content",
    },
    {
      pattern: /exec\s*\(\s*requests\.get\s*\([^)]+\)\.text/i,
      reason: "Python executes code downloaded from internet",
    },
    // Added more dangerous patterns
    {
      pattern: /import\s+(pty|paramiko|pyexecjs)/i,
      reason:
        "Imports potentially dangerous modules for terminal/SSH/JS execution",
    },
    {
      pattern: /socket\.socket\(\s*socket\.AF_INET/i,
      reason: "Creates network socket",
    },
    {
      pattern: /input\s*\(\s*\)[^;]*\s+in\s+(?:locals|globals)\(\)/i,
      reason: "Evaluates user input as code",
    },
    {
      pattern: /pickle\.loads\s*\(\s*requests\.get/i,
      reason: "Deserializes untrusted data (pickle execution vulnerability)",
    },
    {
      pattern:
        /(?:setattr|getattr|eval|exec|compile)\s*\(\s*[^,]+,\s*(?:input|.*\.get)\s*\(/i,
      reason: "Dynamic code execution based on external input",
    },
  ];

  for (const { pattern, reason } of dangerousPythonPatterns) {
    if (pattern.test(content)) {
      return {
        malicious: true,
        reason,
      };
    }
  }

  // Check for suspicious imports - now with stricter rules
  const suspiciousImports = [
    "subprocess",
    "os",
    "pty",
    "socket",
    "paramiko",
    "base64",
    "tempfile",
    "shutil",
  ];

  const foundImports = [];
  for (const suspiciousImport of suspiciousImports) {
    const importRegex = new RegExp(
      `import\\s+${suspiciousImport}|from\\s+${suspiciousImport}\\s+import`,
      "i"
    );
    if (importRegex.test(content)) {
      foundImports.push(suspiciousImport);
    }
  }

  // If we have multiple suspicious imports, consider it malicious
  if (
    foundImports.length >= 2 &&
    (foundImports.includes("subprocess") || foundImports.includes("os")) &&
    (foundImports.includes("socket") || foundImports.includes("paramiko"))
  ) {
    return {
      malicious: true,
      reason: `Combination of suspicious imports: ${foundImports.join(", ")}`,
    };
  }

  // Check for suspicious variable or function names
  if (/def\s+(?:shell|backdoor|exploit|hack|inject)/i.test(content)) {
    return {
      malicious: true,
      reason: "Suspicious function names detected",
    };
  }

  return { malicious: false };
}

// Package.json checker to detect malicious npm scripts
function checkPackageJson(content) {
  try {
    const packageData = JSON.parse(content);

    // Check scripts for malicious commands
    if (packageData.scripts) {
      for (const [scriptName, scriptContent] of Object.entries(
        packageData.scripts
      )) {
        // Check for dangerous commands in npm scripts
        if (
          (scriptContent.includes("curl") &&
            (scriptContent.includes("|") || scriptContent.includes("bash"))) ||
          (scriptContent.includes("wget") &&
            (scriptContent.includes("|") || scriptContent.includes("bash"))) ||
          scriptContent.includes("rm -rf /") ||
          scriptContent.includes("/dev/tcp/") ||
          scriptContent.includes("mkfifo") ||
          scriptContent.includes("base64 -d")
        ) {
          return {
            malicious: true,
            reason: `Malicious command in npm script '${scriptName}': ${scriptContent}`,
          };
        }
      }
    }

    // Check dependencies for known malicious packages
    const suspiciousDependencies = [
      "browserify-sign",
      "event-stream",
      "flatmap-stream",
      "request-promise",
      "electron-native-notify",
      "codecov",
      "node-ipc",
    ];

    const dependencyTypes = [
      "dependencies",
      "devDependencies",
      "optionalDependencies",
    ];

    for (const depType of dependencyTypes) {
      if (packageData[depType]) {
        for (const depName of suspiciousDependencies) {
          if (packageData[depType][depName]) {
            return {
              malicious: false,
              reason: `Package contains potentially suspicious dependency: ${depName} (manual review recommended)`,
            };
          }
        }
      }
    }

    return { malicious: false };
  } catch (error) {
    console.error(`Error parsing package.json: ${error.message}`);
    return {
      malicious: false,
      reason: `Invalid package.json format: ${error.message}`,
    };
  }
}

// Analyze shell scripts
function analyzeShellScript(content) {
  // Check for highly dangerous shell script patterns
  const dangerousShellPatterns = [
    {
      pattern: /rm\s+-rf\s+\/[^*\s\n]/i,
      reason: "Destructive filesystem command",
    },
    {
      pattern: /mkfifo\s+.*\|\s*nc/i,
      reason: "Creates reverse shell using named pipe",
    },
    {
      pattern: /bash\s+-i\s+>\&\s+\/dev\/tcp\//i,
      reason: "Creates interactive reverse shell",
    },
    {
      pattern: /python\s+-c\s+['"]import\s+socket,subprocess/i,
      reason: "Python reverse shell in shell script",
    },
    {
      pattern: /nc\s+.*\s+-e\s+\/bin\/(?:bash|sh)/i,
      reason: "Netcat reverse shell",
    },
    {
      pattern: /curl\s+.*\|\s*sh/i,
      reason: "Downloads and executes script from internet",
    },
    {
      pattern: /wget\s+.*\s+-O\s+.*\|\s*sh/i,
      reason: "Downloads and executes script from internet",
    },
    {
      pattern: /echo\s+.*\|\s*base64\s+-d\s+>\s+.*\.sh.*\s*&&\s*chmod\s+\+x/i,
      reason: "Creates executable from decoded base64",
    },
    {
      pattern: /crontab\s+-e/i,
      reason: "Modifies cron jobs (possible persistence)",
    },
  ];

  for (const { pattern, reason } of dangerousShellPatterns) {
    if (pattern.test(content)) {
      return {
        malicious: true,
        reason,
      };
    }
  }

  return { malicious: false };
}
