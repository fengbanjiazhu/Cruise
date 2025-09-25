import React, { useEffect, useState }  from "react";
import toast from "react-hot-toast";
import { fetchGet, fetchPost, optionMaker } from "../utils/api";

function Review() {
    const [post, setPost] = useState(null);
    const [returnedReviews, setReturnedReviews] = useState(null);
    const [review, setReview] = useState("Enter Review");
    const [rating, setRating] = useState(null)    
    const pathID = "68b41827015cdced49eabf39";
    const userID = "68abbad440fef1e01fe82b34";

    async function getReview() {
        try {
            const returnReviews = await fetchGet("review/"+pathID);
            setReturnedReviews(returnReviews); 
            console.log(returnReviews);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch review, try again later");
        }
    }

    async function getPost() {
        const id = "path/"+pathID;
        try {
            const data = await fetchGet(id);
            setPost(data);
            //console.log(data);
            //console.log(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch path, try again later");
        }
    }

    async function leaveReview() {
        const sendData = {
            review: review,
            raiting: rating,
            path: pathID,
            user: userID

        }

        try {
            await fetchPost("review/CreateReview", optionMaker(sendData));
            toast.success("Congrats! You have left a new review!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to create review, try again later");
        }
    }

    // call getPost when component first renders
    useEffect(() => {
        getPost();
        getReview();
    }, []);

  return (
    <div style={{
        display:"flex",
        flexDirection: "row"
        }}>
        <section>
            <h1>Path</h1>
            {post ? (
                <>
                <p>Review:</p>
                <textarea
                className="border p-2 w-full"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                />
                <input
                    type="radio"
                    name="stars"
                    value="1"
                    checked={rating === 1}
                    onChange={(e) => setRating(e.target.value)}
                />

                <input
                    type="radio"
                    name="stars"
                    value="2"
                    checked={rating === 2}
                    onChange={(e) => setRating(e.target.value)}
                />

                <button
                onClick={leaveReview}
                className="btn text-white mt-4 w-full hover:bg-transparent hover:text-white hover:border-white"
                >
                Submit Review
                </button>
                <pre>{JSON.stringify(post, null, 2)}</pre>
                </>
                
            ) : (
                <p>Loading...</p>
            )}
        </section>
        <section>
            <h1>Review</h1>
            {returnedReviews ? (
                <>
                <pre>{JSON.stringify(returnedReviews, null, 2)}</pre>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    </div>
  );
}

export default Review;
