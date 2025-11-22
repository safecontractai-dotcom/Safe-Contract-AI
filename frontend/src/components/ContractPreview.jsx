import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function ContractPreview({ fileUrl, highlights, jumpTo }) {
  const [numPages, setNumPages] = useState(null);
  const viewerRef = useRef(null);

  // 🌟 Highlight risky text when PDF loads
  useEffect(() => {
    if (!highlights || highlights.length === 0) return;

    const timer = setTimeout(() => {
      const textSpans = document.querySelectorAll(
        ".react-pdf__Page__textContent span"
      );

      textSpans.forEach((span) => {
        const spanText = span.innerText.toLowerCase();

        highlights.forEach((risky) => {
          const risk = risky.toLowerCase();

          if (spanText.includes(risk)) {
            span.style.background = "rgba(255, 225, 100, 0.8)";
            span.style.padding = "2px 4px";
            span.style.borderRadius = "4px";
            span.style.transition = "all 0.3s ease";
          }
        });
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [highlights]);

  // 🌟 Jump-to-risk scroll
  useEffect(() => {
    if (!jumpTo) return;

    const textSpans = document.querySelectorAll(
      ".react-pdf__Page__textContent span"
    );

    for (let span of textSpans) {
      if (span.innerText.toLowerCase().includes(jumpTo.toLowerCase())) {
        span.scrollIntoView({ behavior: "smooth", block: "center" });
        span.style.background = "rgba(255, 215, 80, 1)";
        break;
      }
    }
  }, [jumpTo]);

  return (
    <div
      ref={viewerRef}
      className="
        bg-white/70 backdrop-blur-xl 
        border border-gray-200 rounded-xl 
        shadow-[0_8px_25px_rgba(0,0,0,0.07)]
        p-4 w-full h-[80vh] overflow-auto
      "
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Contract Preview
      </h2>

      {!fileUrl && (
        <p className="text-gray-500 text-sm text-center mt-10">
          Upload a contract to preview it here.
        </p>
      )}

      {fileUrl && (
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              className="mb-4 drop-shadow-sm"
            />
          ))}
        </Document>
      )}
    </div>
  );
}
