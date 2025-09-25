import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { GrDocumentMissing } from "react-icons/gr";

function NoResult({
  title = "There is no match",
  message = "Looks like there is no matching results, please try a different condition",
  children,
}) {
  return (
    <Card className="w-ful h-full m-auto max-w-[900px] rounded-xl bg-white text-[#222] border border-[#ececf0]">
      <CardHeader>
        <CardTitle className="flex gap-2">
          {title} <GrDocumentMissing size={20} />
        </CardTitle>
        <CardDescription>{message}</CardDescription>
        <div></div>
        <div className="mt-2">{children}</div>
      </CardHeader>
    </Card>
  );
}

export default NoResult;
