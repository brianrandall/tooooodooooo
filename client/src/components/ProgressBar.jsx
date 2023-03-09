import React from 'react'

const ProgressBar = ({ progress }) => {

  //create random number between 0 and 255
  const randomNum = () => {
    return Math.floor(Math.random() * 256)
  }

  const randomColor = () => {
    return `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`
  }

  return (
    <div className='outer-bar'>
      <div className='inner-bar' style={{width: `${progress}%`, backgroundColor: `${randomColor()}`}}>
      </div>
    </div>
  )
}

export default ProgressBar