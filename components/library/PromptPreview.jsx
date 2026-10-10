// A small wireframe mock-up of the page a prompt produces, drawn from its colour palette.
// palette: [background, text, primary, accent]
export default function PromptPreview({ palette, layout = "centered", tone = "light" }) {
  const [bg, text, primary, accent] = palette;
  const line = tone === "dark" ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)";
  const soft = tone === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.045)";
  const vars = {
    "--pp-bg": bg,
    "--pp-text": text,
    "--pp-primary": primary,
    "--pp-accent": accent,
    "--pp-line": line,
    "--pp-soft": soft,
  };

  const nav = (
    <div className="pp-nav">
      <i className="pp-logo" />
      <span className="pp-links"><b /><b /><b /></span>
      <i className="pp-btn" />
    </div>
  );

  return (
    <div className={`pp pp-${layout}`} style={vars} aria-hidden="true">
      {layout === "dashboard" ? (
        <div className="pp-dash">
          <div className="pp-side"><i className="pp-logo" /><b /><b className="is-on" /><b /><b /><b /></div>
          <div className="pp-main">
            <div className="pp-kpis"><i /><i /><i /><i /></div>
            <div className="pp-chart"><span style={{ height: "45%" }} /><span style={{ height: "70%" }} /><span style={{ height: "55%" }} /><span style={{ height: "90%" }} /><span style={{ height: "65%" }} /><span style={{ height: "80%" }} /></div>
            <div className="pp-rows"><b /><b /><b /></div>
          </div>
        </div>
      ) : layout === "bio" ? (
        <div className="pp-bio-col">
          <i className="pp-avatar" />
          <b className="pp-h pp-w-50" />
          <b className="pp-t pp-w-70" />
          <span className="pp-link is-primary" />
          <span className="pp-link" />
          <span className="pp-link" />
          <span className="pp-link" />
        </div>
      ) : layout === "product" ? (
        <>
          {nav}
          <div className="pp-two">
            <div className="pp-media"><i /><span><b /><b /><b /></span></div>
            <div className="pp-copy">
              <b className="pp-h pp-w-90" />
              <b className="pp-t pp-w-50" />
              <b className="pp-price" />
              <span className="pp-swatches"><i /><i /><i /></span>
              <i className="pp-cta" />
            </div>
          </div>
        </>
      ) : layout === "split" ? (
        <>
          {nav}
          <div className="pp-two">
            <div className="pp-copy">
              <b className="pp-eyebrow" />
              <b className="pp-h pp-w-90" />
              <b className="pp-h pp-w-70" />
              <b className="pp-t pp-w-80" />
              <i className="pp-cta" />
            </div>
            <div className="pp-figure" />
          </div>
          <div className="pp-cards"><i /><i /><i /></div>
        </>
      ) : (
        <>
          {nav}
          <div className="pp-center">
            <b className="pp-pill" />
            <b className="pp-h pp-w-70" />
            <b className="pp-h pp-w-50" />
            <b className="pp-t pp-w-60" />
            <span className="pp-actions"><i className="pp-cta" /><i className="pp-cta is-ghost" /></span>
          </div>
          <div className="pp-cards"><i /><i /><i /></div>
        </>
      )}
    </div>
  );
}
