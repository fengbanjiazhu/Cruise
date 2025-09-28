import React from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

function ClearSearchBtn({ className, title = "Clear Condition" }) {
  const [, setSearchParams] = useSearchParams();

  return (
    <Button
      className={`bg-red-500 text-white rounded ${className}`}
      onClick={() => setSearchParams({})}
    >
      {title}
    </Button>
  );
}

export default ClearSearchBtn;
