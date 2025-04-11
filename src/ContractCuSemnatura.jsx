
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

export default function ContractCuSemnatura() {
  const canvasRef = useRef(null);
  const [nume, setNume] = useState("");

  const handleGenerate = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(18);
    doc.text("Contract de colaborare", 105, 20, null, null, "center");

    doc.setFontSize(12);
    const lines = [
      `Între Asociația Culturală Artiști în Ascensiune, denumită în continuare „Asociația”,`,
      `și subsemnatul ${nume || "_____________________________"}, denumit în continuare „Colaboratorul”,`,
      "s-a convenit următoarele:",
      "",
      "1. Colaboratorul va susține activitățile culturale organizate de Asociație.",
      "2. Asociația va susține promovarea și includerea colaboratorului în evenimente culturale.",
      "3. Prezentul contract este valabil de la data semnării până la 31 decembrie 2025."
    ];

    let y = 40;
    lines.forEach((line) => {
      doc.text(line, 20, y);
      y += 8;
    });

    doc.setFontSize(12);
    doc.text("Semnătură olografă:", 20, y + 20);

    const canvas = canvasRef.current;
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 60, y + 15, 100, 40);
    }

    doc.text("Data: ______________", 20, y + 65);
    doc.save("Contract_semnat.pdf");
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    let drawing = true;
    const rect = canvas.getBoundingClientRect();
    const getPos = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      return [x - rect.left, y - rect.top];
    };

    const draw = (e) => {
      if (!drawing) return;
      const [x, y] = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      drawing = false;
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };

    const [startX, startY] = getPos(e);
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">Contract cu semnătură olografă</h1>
      <input
        type="text"
        placeholder="Numele complet al colaboratorului"
        value={nume}
        onChange={(e) => setNume(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md"
      />

      <p className="text-gray-600 mb-2">Semnează mai jos (cu degetul sau mouse-ul):</p>
      <canvas
        ref={canvasRef}
        width={300}
        height={120}
        className="border border-gray-300 rounded mb-4"
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
      ></canvas>

      <Button onClick={handleGenerate}>Generează PDF cu semnătură</Button>
    </div>
  );
}
