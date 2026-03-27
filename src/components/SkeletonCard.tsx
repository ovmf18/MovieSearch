import './SkeletonCard.scss';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster shimmer"></div>
      <div className="skeleton-info">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-date shimmer"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
