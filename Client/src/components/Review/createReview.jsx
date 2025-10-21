// Sean
import { useEffect, useState } from "react";
import { fetchPost, fetchGet } from "../../utils/api";
import { Rating, RatingButton } from "@/components/ui/rating";

function CreateReview({ pathId, userId, fetchReviews }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [alreadyReviewed, setReviewed] = useState(false);
  const [reviewId, setReviewID] = useState("");

  useEffect(() => {
    fetchSingleReview();
  }, [pathId, userId]);

  const fetchSingleReview = async () => {
    try {
      const data = await fetchGet(`review/${pathId}/user/${userId}`);
      //console.log(data.data.data.id);
      setReview(data.data.data.review);
      setRating(data.data.data.rating);
      setReviewID(data.data.data.id);
      setReviewed(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetchPost("review/CreateReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review,
          rating,
          path: pathId,
          user: userId,
        }),
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      //console.log(reviewId)
      const res = await fetchPost(`review/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review,
          rating,
          path: pathId,
          user: userId,
        }),
      });

      console.log("Edited review:", res);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const res = await fetchPost(`review/${reviewId}`, {
        method: "DELETE",
      });

      console.log("Deleted review:", res);
      fetchReviews();
    } catch (err) {
      setReview("");
      setRating(5);
      setReviewID("");
      setReviewed(false);
      console.error(err);
    }
  };

  const handleSetRate = function (rating) {
    // console.log("Rating:", index);
    setRating(rating);
  };

  return (
    <form
      onSubmit={alreadyReviewed ? handleUpdate : handleSubmit}
      className="p-4 border rounded-lg shadow-md h-full gap-4 flex flex-col w-full"
    >
      <textarea
        className="w-full border p-2 rounded h-32"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <Rating defaultValue={rating} onValueChange={handleSetRate}>
        {Array.from({ length: 5 }).map((_, index) => (
          <RatingButton key={index} />
        ))}
      </Rating>
      <div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {alreadyReviewed ? <p>Update Review</p> : <p>Submit Review</p>}
        </button>
        {alreadyReviewed ? (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default CreateReview;
