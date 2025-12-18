// src/components/blockmark-widget.tsx

const BlockmarkWidget = () => {
  return (
    <section className="bg-background py-10">
      <div className="flex justify-center">
        <iframe
          src="https://registry.blockmarktech.com/certificates/17029d52-efbe-4ca6-b4ba-bd2f5b34d18a/widget/?tooltip_position=bottom_right&theme=transparent&hover=t"
          className="blockmark-widget"
          title="Cyber Essentials / Blockmark certificate"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default BlockmarkWidget;
