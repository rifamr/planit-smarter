import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import html2canvas from "html2canvas";
import { Trash2, UploadCloud, ImagePlus, Move } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// Helpers
const LS_KEY = "moodBoardItems";

type Item = { id: string; src: string };

const sampleUrls = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
];

async function toDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });
  } catch {
    return url; // fallback
  }
}

function fileListToItems(files: FileList): Promise<Item[]> {
  const promises = Array.from(files).map(
    (file) =>
      new Promise<Item>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ id: crypto.randomUUID(), src: String(reader.result) });
        reader.readAsDataURL(file);
      })
  );
  return Promise.all(promises);
}

const containerVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const MoodBoard = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted or sample images
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed: Item[] = JSON.parse(saved);
        setItems(parsed);
        return;
      } catch {}
    }
    // Seed for new users (converted to data URLs for reliable export)
    (async () => {
      const seeded = await Promise.all(sampleUrls.map(async (u) => ({ id: crypto.randomUUID(), src: await toDataUrl(u) })));
      setItems(seeded);
    })();
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  // DnD reorder
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updated = Array.from(items);
    const [removed] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, removed);
    setItems(updated);
  };

  // Drop images (files or URLs)
  const onDropFiles = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const dt = e.dataTransfer;
    const files = dt.files;
    const url = dt.getData("text/uri-list") || dt.getData("text");

    const newItems: Item[] = [];

    if (files && files.length) {
      newItems.push(...(await fileListToItems(files)));
    } else if (url) {
      const src = await toDataUrl(url);
      newItems.push({ id: crypto.randomUUID(), src });
    }

    if (newItems.length) {
      setItems((prev) => [...newItems, ...prev]);
    }
  }, []);

  const onPickFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const imgs = await fileListToItems(e.target.files);
    setItems((prev) => [...imgs, ...prev]);
    e.target.value = ""; // reset
  };

  const removeAt = (idx: number) => {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  };

  // Export the board as image
  const exportBoard = async () => {
    if (!gridRef.current) return;
    const canvas = await html2canvas(gridRef.current, { backgroundColor: null, useCORS: true, scale: window.devicePixelRatio || 2 });
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = "mood-board.png";
    link.click();
  };

  const gridCols = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4";

  const empty = useMemo(() => items.length === 0, [items]);

  return (
    <section id="mood-board" className="section-padding container-padding bg-section-alt">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Trip Mood Board</h2>
          <div className="flex gap-2">
            <button onClick={() => inputRef.current?.click()} className="btn-ghost inline-flex items-center gap-2"><ImagePlus className="h-4 w-4"/>Add Images</button>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
            <button onClick={exportBoard} className="btn-primary">Save Mood Board</button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="mood-board" direction="horizontal" renderClone={(provided, snapshot, rubric) => null}>
            {(dropProvided, dropSnapshot) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragEnter={() => setIsDraggingOver(true)}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={onDropFiles}
                className={`relative rounded-2xl border border-dashed p-4 min-h-[220px] transition ${isDraggingOver ? 'border-primary bg-primary/5' : 'border-border/60'}`}
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <UploadCloud className="h-4 w-4" />
                  <p className="text-sm">Drag images here or click "Add Images". Tip: You can also drop links.</p>
                </div>

                <div ref={gridRef} className={gridCols}>
                  <AnimatePresence initial={false}>
                    {items.map((it, index) => (
                      <Draggable key={it.id} draggableId={it.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm ${snapshot.isDragging ? 'ring-2 ring-primary shadow-xl' : ''}`}
                          >
                            <img src={it.src} alt="mood" className="w-full h-40 object-cover pointer-events-none select-none" />

                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            />

                            <div className="absolute top-2 left-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div {...provided.dragHandleProps} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-black/40 text-white/90 backdrop-blur-md">
                                    <Move className="h-3.5 w-3.5"/>Drag
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>Reorder by dragging</TooltipContent>
                              </Tooltip>
                            </div>

                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button aria-label="Remove" onClick={() => removeAt(index)} className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Remove image</TooltipContent>
                              </Tooltip>
                            </div>

                            <motion.div
                              aria-hidden
                              className="absolute inset-0 ring-0 group-hover:ring-2 ring-accent/60 pointer-events-none"
                              transition={{ duration: 0.2 }}
                            />
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {dropProvided.placeholder}
                </div>

                {empty && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-center text-muted-foreground h-40"
                  >
                    Your mood board is empty. Add some inspiration!
                  </motion.div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </section>
  );
};

export default MoodBoard;
