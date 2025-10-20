import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import toast from "react-hot-toast";
import { fetchGet } from "../utils/api";
import CreateReview from "./createReview";
import ReviewList from "../components/Review/ReviewList";

function Review({ pathId }) {
  const currentUser = useSelector((state) => state.userInfo.user);
  const [pathData, setPathData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pathId) return;

    setLoading(true); // Reset loading state
    setError(null); // Reset error state

    const fetchPath = async () => {
      try {
        const data = await fetchGet(`path/${pathId}`);
        setPathData(data.data.data);
        //console.log(data.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await fetchGet(`review/${pathId}`);
        setReviews(data.data.data);
        //console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPath();
    fetchReviews();
  }, [pathId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-80 w-full">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-4">
          {/* <h2 className="text-center text-2xl mb-2">Reviews</h2> */}
          <ReviewList reviews={reviews} />
        </div>
        <div className="col-span-1 p-4">
          <CreateReview pathId={pathId} userId={currentUser._id} />
        </div>
      </div>
    </div>
  );
}
export default Review;

/* 
<div>
            <h1>Review Path</h1>
            <p>Name: {pathData.name}</p>
            <p>Creator: {pathData.creator?.name}</p>
            <p>Description: {pathData.description}</p>
            <p>ID: {pathData.id}</p>
        </div>
*/
