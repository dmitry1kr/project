import StarRatings from 'react-star-ratings'

import React from 'react'

const Rating = ({star}) => {
  return (
    <StarRatings
        rating={star}
        starRatedColor="#702DFF"
        starDimension='15px'
        starSpacing='2px'
    />
  )
}

export default Rating
