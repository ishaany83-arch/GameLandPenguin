import React from 'react';
import { FileText, Share2, Printer, Undo, Redo, ZoomIn, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, X, Lock } from 'lucide-react';

interface DisguiseOverlayProps {
  onExit: () => void;
}

export const DisguiseOverlay: React.FC<DisguiseOverlayProps> = ({ onExit }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f9fa] text-slate-900 font-sans flex flex-col select-text overflow-auto">
      {/* Google Docs Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-blue-600 text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-800">AP History Research Paper - Industrial Era.docx</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-300 font-medium">
                Saved to Drive
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5 font-normal">
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">File</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Edit</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">View</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Insert</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Format</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Tools</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Extensions</span>
              <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border border-blue-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Private to me</span>
          </div>
          <button className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          
          {/* Subtle exit button */}
          <button
            onClick={onExit}
            className="ml-4 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded transition-colors"
            title="Exit Disguise Mode"
            id="exit-disguise-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Docs Toolbar */}
      <div className="bg-[#edf2fa] border-b border-gray-300 px-4 py-1.5 flex items-center gap-3 text-gray-700 text-xs shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button className="p-1 hover:bg-gray-200 rounded"><Undo className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><Redo className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><Printer className="w-3.5 h-3.5" /></button>
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <span className="bg-white px-2 py-0.5 rounded border border-gray-300 text-xs">100%</span>
          <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <span className="bg-white px-2 py-0.5 rounded border border-gray-300 text-xs font-serif font-bold">Arial</span>
          <span className="bg-white px-2 py-0.5 rounded border border-gray-300 text-xs font-bold">11</span>
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
          <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
          <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-200 rounded"><AlignLeft className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><AlignCenter className="w-3.5 h-3.5" /></button>
          <button className="p-1 hover:bg-gray-200 rounded"><AlignRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Main Document Body Canvas */}
      <div className="flex-1 bg-[#f8f9fa] p-4 sm:p-8 flex justify-center overflow-y-auto">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-sm border border-gray-200 min-h-[900px] p-12 sm:p-16 text-gray-800 space-y-6 leading-relaxed text-sm">
          <h1 className="text-2xl font-bold text-center text-gray-900 border-b pb-4">
            The Socioeconomic Impact of the Industrial Revolution in Western Europe (1760–1840)
          </h1>

          <div className="text-xs text-gray-500 italic text-center">
            Author: Academic Notes | Subject: World History & Economics | Course ID: HIS-302
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">1. Abstract & Thesis Statement</h2>
            <p>
              The Industrial Revolution marked a fundamental shift in human history, transitioning agrarian economies into mechanized manufacturing hubs. Driven by technological innovations such as James Watt’s improved steam engine and the mechanized spinning jenny, rapid urbanization reshaped demographic patterns across Great Britain and Western Europe.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">2. Key Drivers of Early Industrialization</h2>
            <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm">
              <li><strong>Capital Accumulation:</strong> Expansion of international trade networks and banking infrastructure.</li>
              <li><strong>Agrarian Efficiency:</strong> Enclosure acts and selective breeding released surplus labor into urban factories.</li>
              <li><strong>Resource Abundance:</strong> Domestically accessible coal and iron ore deposits in northern England.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">3. Urbanization & Labor Dynamics</h2>
            <p>
              By 1850, more than half of Britain's population resided in cities such as Manchester, Birmingham, and Leeds. While factory production increased overall material output exponentially, early working environments were characterized by 12 to 16 hour shifts, minimal safety regulations, and widespread child labor prior to the passage of the Factory Act of 1833.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">4. Historical Analysis & Conclusion</h2>
            <p>
              In conclusion, the transformative decades between 1760 and 1840 laid the technological and institutional framework for modern industrialized society. The synthesis of steam power, factory organization, and capital markets permanently altered global trade equilibrium.
            </p>
          </section>
        </div>
      </div>

      {/* Floating Unhide Trigger in corner */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold shadow-lg flex items-center gap-1.5"
          id="exit-disguise-floating-btn"
        >
          <span>🐧 Return to GameLand</span>
        </button>
      </div>
    </div>
  );
};
