import { useEffect, useState } from "react";
import { fetchPost, fetchGet } from "../utils/api";


function CreateReview({ pathId, userId }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

    useEffect(() => {
        const fetchSingleReview = async () => {
            try {
                const data = await fetchGet(`review/userReview/68d3d089f375d8ca50015b4e`);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSingleReview();
    })
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

      console.log("Created review:", res);
    } catch (err) {
      console.error(err);
    } 
  };


  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md">
      <textarea
        className="w-full border p-2 rounded mb-2"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <select
        className="border p-2 rounded mb-2"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} ⭐
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Review
      </button>
    </form>
  );
}

export default CreateReview;
