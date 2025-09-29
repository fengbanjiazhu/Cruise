import React, { useEffect, useState }  from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
//import toast from "react-hot-toast";
import { fetchGet} from "../utils/api";
import CreateReview from "./createReview";

function Review() {
    const location = useLocation();
    const currentUser = useSelector(state => state.userInfo.user);
    const pathId = location.state?.id;
    const [pathData, setPathData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    if (!pathId) return;

    setLoading(true); // Reset loading state
    setError(null);   // Reset error state

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
    }

    fetchPath();
    fetchReviews();
  }, [pathId]);

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
        <div>
            <h1>Review Path</h1>
            <p>Name: {pathData.name}</p>
            <p>Creator: {pathData.creator?.name}</p>
            <p>Description: {pathData.description}</p>
            <p>ID: {pathData.id}</p>
        </div>
        <CreateReview pathId={pathId} userId={currentUser._id}/>
        <section>
            {reviews.map((review) => (
            <div key={review._id} className="bg-[#ffffff] rounded-[8px] [box-shadow:0_4px_6px_rgba(0,_0,_0,_0.1)] p-[24px] m-[16px]">
                <p><strong>{review.user.name}</strong></p>
                <p>{review.review}</p>
                <small>{new Date(review.createdAt).toLocaleString()}</small>
            </div>
            ))}
        </section>
    </main>

  );
}
export default Review;
