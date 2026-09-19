const RatingStars = ({ rating = 0 }) => {
    return (
        <span>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {star <= Number(rating) ? "★" : "☆"}
                </span>
            ))}
        </span>
    );
};

export default RatingStars;