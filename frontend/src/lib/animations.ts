
import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
};

export const slideUpFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    } 
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20 
    } 
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    } 
  }
};

export const slideInFromRight: Variants = {
  hidden: { x: 30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  },
  exit: { 
    x: 20, 
    opacity: 0, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    } 
  }
};

export const slideInFromLeft: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  },
  exit: { 
    x: -20, 
    opacity: 0, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    } 
  }
};

export const shieldAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      ease: [0, 0.55, 0.45, 1],
      delay: 0.2
    } 
  }
};

export const loaderTextAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.8
    } 
  }
};

export const loaderCharAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 12, 
      stiffness: 200 
    } 
  }
};

export const scannerOverlayAnimation: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: { 
    opacity: 1, 
    scaleY: 1, 
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    transition: { 
      duration: 0.2
    } 
  }
};

export const errorShake: Variants = {
  hidden: { x: 0 },
  visible: { 
    x: [0, -8, 8, -6, 6, -4, 4, 0], 
    transition: { 
      duration: 0.5 
    } 
  }
};
