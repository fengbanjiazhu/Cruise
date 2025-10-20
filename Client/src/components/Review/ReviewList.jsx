import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <ScrollArea className="rounded-md border h-full">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-[#ffffff] rounded-[8px] [box-shadow:0_4px_6px_rgba(0,_0,_0,_0.1)] p-2 m-[16px] w-64 h-full"
        >
          <strong className="text-center">Review made by: {review.user.name}</strong>
          <p className="overflow-scroll my-2  px-2 rounded-md border">{review.review}</p>
          <small className="text-center">{new Date(review.createdAt).toLocaleString()}</small>
        </div>
      ))}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default ReviewList;
