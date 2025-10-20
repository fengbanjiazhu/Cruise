import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Rating, RatingButton } from "@/components/ui/rating";

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <ScrollArea className="rounded-md border h-72 w-full">
      <div className="flex w-max space-x-4 p-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-[8px] shadow-md p-2 flex-shrink-0 w-64">
            <i className="text-sm mr-4">Review by: </i>
            <strong className="text-center">{review.user.name}</strong>

            <p className="overflow-y-auto my-2 px-2 rounded-md border h-36">{review.review}</p>

            <Rating className="mb-2" value={review.rating} readOnly>
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingButton key={index} />
              ))}
            </Rating>

            <small className="block">{new Date(review.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default ReviewList;
