import { useState } from "react";
import { Reorder } from "framer-motion";

const seed = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
];

const MoodBoard = () => {
  const [items, setItems] = useState<string[]>(seed);

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text");
    if (url) setItems((arr) => [url, ...arr]);
  };

  return (
    <section id="mood-board" className="section-padding container-padding bg-section-alt">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Trip Mood Board</h2>
          <div className="flex gap-2">
            <button className="btn-ghost">Save</button>
            <button className="btn-primary">Share</button>
          </div>
        </div>
        <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} className="rounded-2xl border border-dashed p-4 min-h-[200px]">
          <p className="text-sm text-muted-foreground mb-2">Drag images here</p>
          <Reorder.Group as="div" axis="y" values={items} onReorder={setItems} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((src) => (
              <Reorder.Item as="div" key={src} value={src} whileDrag={{ scale: 1.02 }} className="overflow-hidden rounded-xl hover:shadow-xl transition-all">
                <img src={src} alt="mood" loading="lazy" className="w-full h-40 object-cover" />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </section>
  );
};

export default MoodBoard;
