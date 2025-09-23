import { Skeleton } from "@/components/ui/skeleton";

function Loading({ classNames }) {
  return (
    <div className="flex flex-col space-y-3 mx-auto mt-5">
      <Skeleton className={`h-[125px] w-[250px] rounded-xl ${classNames}`} />
    </div>
  );
}

export default Loading;
