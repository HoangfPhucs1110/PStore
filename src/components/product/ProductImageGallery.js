import { useState } from "react";

export default function ProductImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/placeholder.png"];

  return (
    <div>
      <div className="mb-2 border rounded overflow-hidden d-flex align-items-center justify-content-center" style={{height: 350}}>
        <img src={list[active]} alt="" className="w-100 h-100 object-fit-contain" />
      </div>
      <div className="d-flex gap-2 overflow-auto">
        {list.map((img, i) => (
          <img 
            key={i} src={img} alt="" 
            width="60" height="60" 
            className={`border rounded cursor-pointer object-fit-cover ${i === active ? "border-primary" : ""}`} 
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}