// Animation variants for admin components
export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  },

  item: {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },

  tab: {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  },

  tableRow: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  },

  refresh: {
    initial: { opacity: 1 },
    refreshing: {
      opacity: 0.7,
      transition: { duration: 0.3 },
    },
    refreshed: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },

  fadeSlideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  modal: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    content: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
    },
  },
};

// Common motion props
export const MOTION_PROPS = {
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  tableRowHover: {
    whileHover: {
      backgroundColor: "#f9fafb",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  },

  modalContent: {
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4,
    },
  },
};
