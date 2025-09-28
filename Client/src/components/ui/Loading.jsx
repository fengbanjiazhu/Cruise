import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Loading({ classNames }) {
  return (
    <Card
      className={`w-ful h-full m-auto max-w-[900px] rounded-xl bg-white text-[#222] border border-[#ececf0] ${classNames}`}
    >
      <CardHeader>
        <CardTitle className="flex gap-2">
          Loading <AiOutlineLoading3Quarters size={20} className="animate-spin text-blue-500" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default Loading;
