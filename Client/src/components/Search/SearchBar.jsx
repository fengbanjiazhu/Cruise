// Jeffrey
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchForm from "./SearchForm";

function SearchBar() {
  return (
    <Sheet>
      <SheetTrigger className="border-slate-300">Search</SheetTrigger>
      <SheetContent className="w-[200px] sm:w-[300px] mt-14 rounded-lg pt-10 ">
        <SheetHeader>
          <SheetTitle>Search Options</SheetTitle>
          <SheetDescription>
            <SearchForm />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default SearchBar;
