import { BrainCircuit, X } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";


export interface ExpandedModalProps {
    onClose: () => void;
    visible: boolean;
    title?: string;
    children: React.ReactNode;
    description?: string;   
}

export const ExpandedModal: React.FC<ExpandedModalProps> = ({ onClose, visible, children, description, title }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-8 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl text-redtab">
                  <BrainCircuit size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
                  <p className="text-xs text-gray-400 font-medium">{description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-gray-900 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-800 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-700 [&_p]:text-sm [&_p]:text-gray-600 [&_ul]:text-sm [&_ol]:text-sm [&_li]:text-gray-600 [&_strong]:text-gray-800">
                <Markdown>{children?.toString() || ''}</Markdown>
              </div>
            </div>
          </div>
        </div>
    );
}