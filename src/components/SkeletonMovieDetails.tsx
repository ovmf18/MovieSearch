import './SkeletonMovieDetails.scss';

const SkeletonMovieDetails = () => {
  return (
    <div className="movie-details-page skeleton-details-page">
      <div className="details-container">
        <div className="skeleton-back-btn shimmer"></div>

        <div className="main-info">
          <div className="poster-side">
            <div className="skeleton-main-poster shimmer"></div>
            <div className="skeleton-box shimmer" style={{ height: '200px', marginTop: '2rem' }}></div>
            <div className="skeleton-box shimmer" style={{ height: '300px', marginTop: '1.5rem' }}></div>
          </div>

          <div className="content-side">
            <div className="skeleton-text shimmer title"></div>
            <div className="skeleton-text shimmer subtitle"></div>
            
            <div className="skeleton-meta-row">
               <div className="skeleton-box shimmer cert"></div>
               <div className="skeleton-text shimmer meta-text"></div>
               <div className="skeleton-text shimmer meta-text-long"></div>
            </div>

            <div className="skeleton-rating-row">
               <div className="skeleton-box shimmer rating-badge"></div>
               <div className="skeleton-box shimmer action-btn"></div>
               <div className="skeleton-box shimmer action-btn"></div>
            </div>

            <div className="skeleton-overview">
               <div className="skeleton-text shimmer overview-title"></div>
               <div className="skeleton-text shimmer line"></div>
               <div className="skeleton-text shimmer line-90"></div>
               <div className="skeleton-text shimmer line-95"></div>
               <div className="skeleton-text shimmer line-60"></div>
            </div>

            <div className="skeleton-cast-grid">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-box shimmer cast-card"></div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonMovieDetails;
