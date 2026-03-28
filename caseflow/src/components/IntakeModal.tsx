import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Mic, FileText, Sparkles, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ingestFile, apiPost, processCase } from "../lib/api";

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntakeModal({ isOpen, onClose }: IntakeModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setStatus("uploading");
    setStatusMessage("Uploading to Gemini...");

    try {
      const file = files[0];
      const result = await ingestFile(file);

      setStatus("processing");
      setStatusMessage("Running AI orchestration pipeline...");

      // If we got a message back, run the full orchestration
      if (result.message?._id) {
        await processCase(result.message._id);
      }

      setStatus("done");
      setStatusMessage("Case created and AI analysis complete!");

      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Intake failed:", err);
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setStatus("uploading");
    setStatusMessage("Sending to Gemini for triage...");

    try {
      // Create a message from pasted text
      const result = await apiPost("/messages", {
        type: "email",
        channel: "web_form",
        from: { name: "Manual Entry", district: "IL-13" },
        subject: textInput.slice(0, 80),
        body: textInput,
      });

      setStatus("processing");
      setStatusMessage("Running AI orchestration pipeline...");

      // Run orchestration
      if (result._id) {
        await processCase(result._id);
      }

      setStatus("done");
      setStatusMessage("Case created and AI analysis complete!");
      setTextInput("");
      setShowTextInput(false);

      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Text intake failed:", err);
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
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

          {status !== "idle" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                status === "done" ? "bg-primary/10" : status === "error" ? "bg-red-100" : "bg-primary/10"
              }`}>
                {status === "done" ? (
                  <CheckCircle size={24} className="text-primary" />
                ) : status === "error" ? (
                  <X size={24} className="text-red-500" />
                ) : (
                  <Sparkles size={24} className="text-primary animate-spin" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground">{statusMessage}</p>
              {(status === "uploading" || status === "processing") && (
                <p className="text-xs text-muted-foreground mt-1">
                  {status === "uploading" ? "Gemini is analyzing your input..." : "3 AI agents running in parallel..."}
                </p>
              )}
            </motion.div>
          ) : showTextInput ? (
            <>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste constituent message, case notes, or any text here..."
                className="w-full h-40 p-3 rounded-xl border border-sage-300 bg-secondary/40 text-sm text-foreground resize-none focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowTextInput(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-sage-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  Submit to AI
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("intake-file")?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                  dragActive ? "border-primary bg-primary/5" : "border-sage-300 hover:border-sage-400"
                }`}
              >
                <input
                  id="intake-file"
                  type="file"
                  accept="image/*,application/pdf,audio/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
                <Upload size={32} className="mx-auto text-sage-400 mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Upload, Speak, or Paste</p>
                <p className="text-xs text-muted-foreground">Drop files here or click to upload</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {/* Voice input would use Gemini Live API */}}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-sage-200 transition-colors"
                >
                  <Mic size={16} />
                  Voice Input
                </button>
                <button
                  onClick={() => setShowTextInput(true)}
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