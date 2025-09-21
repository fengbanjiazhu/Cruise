import React from "react";

function OldCard({ children, className = "" }) {
  return (
    <div
      class={`max-w-[340px] p-10 bg-[rgba(200,200,200,0.6)] color-slate-900 overflow-y-auto overflow-x-hidden relative z-[1] flex flex-col rounded-[10px] shadow-[0_0_0_8px_rgba(255,255,255,0.2)] ${className}`}
    >
      {children}
    </div>
  );
}

export default OldCard;
