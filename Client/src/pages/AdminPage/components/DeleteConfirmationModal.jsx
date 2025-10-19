import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_VARIANTS, MOTION_PROPS } from "../constants/animations";

function DeleteConfirmationModal({ incidentId, onConfirm, onCancel }) {
  if (!incidentId) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        {...ANIMATION_VARIANTS.modal.overlay}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white rounded-lg p-6 max-w-md mx-auto"
          {...ANIMATION_VARIANTS.modal.content}
          {...MOTION_PROPS.modalContent}
        >
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Confirm Rejection
          </h3>
          <p className="mb-6 text-gray-700">
            Are you sure you want to reject incident {incidentId}? This will
            mark it as rejected but keep the record.
          </p>
          <div className="flex justify-end space-x-3">
            <motion.button
              onClick={onCancel}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-300"
              {...MOTION_PROPS.button}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
              {...MOTION_PROPS.button}
            >
              Reject Incident
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteConfirmationModal;
