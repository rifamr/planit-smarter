import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

const cards = [
  { title: "Bali Beach 360°", img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200" },
  { title: "Swiss Peak 360°", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200" },
  { title: "Paris Rooftops 360°", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200" },
];

const VirtualTours = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="virtual-tours" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">360° Virtual Tours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Dialog key={c.title} open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="relative rounded-2xl overflow-hidden cursor-pointer hover-lift hover-glow">
                  <img src={c.img} alt={c.title} className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white font-semibold">{c.title}</div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogTitle>{c.title}</DialogTitle>
                <DialogDescription>360° Live Tours Coming Soon!</DialogDescription>
                <div className="mt-4 space-y-3">
                  <div className="h-40 w-full skeleton rounded-xl" />
                  <div className="h-4 w-1/2 skeleton" />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VirtualTours;
