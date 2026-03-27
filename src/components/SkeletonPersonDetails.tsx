import './SkeletonPersonDetails.scss';

const SkeletonPersonDetails = () => {
  return (
    <div className="person-details-page skeleton-person-page">
      <div className="person-backdrop"></div>
      
      <div className="person-container">
        <div className="skeleton-back-btn shimmer"></div>

        <div className="main-info">
          <div className="profile-side">
            <div className="skeleton-profile-poster shimmer"></div>
            
            <div className="skeleton-personal-info">
              <div className="skeleton-text shimmer info-header"></div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-info-block">
                  <div className="skeleton-text shimmer label"></div>
                  <div className="skeleton-text shimmer value"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-side">
            <div className="skeleton-text shimmer person-name"></div>
            
            <div className="skeleton-section">
              <div className="skeleton-text shimmer section-title"></div>
              <div className="skeleton-text shimmer bio-line"></div>
              <div className="skeleton-text shimmer bio-line-95"></div>
              <div className="skeleton-text shimmer bio-line-90"></div>
              <div className="skeleton-text shimmer bio-line-60"></div>
            </div>

            <div className="skeleton-section">
              <div className="skeleton-text shimmer section-title"></div>
              <div className="skeleton-known-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton-movie-credit">
                    <div className="skeleton-box shimmer movie-card-skeleton"></div>
                    <div className="skeleton-text shimmer credit-text"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPersonDetails;
