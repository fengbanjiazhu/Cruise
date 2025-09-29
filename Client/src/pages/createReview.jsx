import { useEffect, useState } from "react";
import { fetchPost, fetchGet } from "../utils/api";


function CreateReview({ pathId, userId }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [alreadyReviewed, setReviewed] = useState(false);
  const [reviewId, setReviewID] = useState("");

    useEffect(() => {
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

        fetchSingleReview();
    }, [pathId, userId]);

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
		window.location.reload();
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
    } catch (err) {
        console.error(err);
    } 
  };

  const handleDelete = async (e) => {
        e.preventDefault();

        try {
		//console.log(reviewId)
        const res = await fetchPost(`review/${reviewId}`, {
    		method: "DELETE",
  		});

        console.log("Deleted review:", res);
		window.location.reload();
    } catch (err) {
        console.error(err);
    } 
  };

  return (
    <form onSubmit={alreadyReviewed ? handleUpdate : handleSubmit} className="p-4 border rounded-lg shadow-md">
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
    </form>


  );
}

export default CreateReview;
