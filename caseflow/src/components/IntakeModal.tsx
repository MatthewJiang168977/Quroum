import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Mic, FileText } from "lucide-react";
import { useState } from "react";

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntakeModal({ isOpen, onClose }: IntakeModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="glass rounded-2xl w-full max-w-lg p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">New Case</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText size={24} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Case submitted</p>
              <p className="text-xs text-muted-foreground mt-1">AI is parsing your input…</p>
            </motion.div>
          ) : (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleSubmit(); }}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-sage-300 hover:border-sage-400"
                }`}
              >
                <Upload size={32} className="mx-auto text-sage-400 mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Upload, Speak, or Paste</p>
                <p className="text-xs text-muted-foreground">Drop files here or click to upload</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-sage-200 transition-colors"
                >
                  <Mic size={16} />
                  Voice Input
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-sage-200 transition-colors"
                >
                  <FileText size={16} />
                  Paste Text
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Zero forms. AI parses your input automatically.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
