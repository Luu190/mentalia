import React from "react";
import { Filter } from "lucide-react";

const options = ["Todos", "Feliz", "Normal", "Triste", "Ansioso", "Enojado"];

export default function FiltroEstado({ value, onChange }) {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
