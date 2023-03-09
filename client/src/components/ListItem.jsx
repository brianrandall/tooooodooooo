import { useState } from 'react'
import React from 'react'
import ProgressBar from './ProgressBar'
import CheckIcon from './CheckIcon'
import Modal from './Modal'
import axios from 'axios'

const ListItem = ({ task, getData }) => {

  const [showModal, setShowModal] = useState(false)

  const deleteTodo = () => {
    axios.delete(`${process.env.REACT_APP_API_URL}/todos/${task.id}`)
      .then(res => {
        if (res.status === 200) {
          console.log('success')
          getData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <li className='list-item'>
      <div className='info-container'>
        <CheckIcon />
        <p className='task-title'>{task.title}</p>
      </div>
      <div className='bar-container'>
          <ProgressBar progress={task.progress}/>
      </div>
      <div className='button-container'>
        <button className='edit-button' onClick={() => setShowModal(true)}>EDIT</button>
        <button className='delete-button' onClick={deleteTodo}>DELETE</button>
      </div>
      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData} />}

    </li>
  )
}

export default ListItem