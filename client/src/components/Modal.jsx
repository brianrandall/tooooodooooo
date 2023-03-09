import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const Modal = ({ mode, setShowModal, task, getData }) => {

  const editMode = mode === 'edit' ? true : false
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 50,
    date: editMode ? '' : new Date().toISOString().slice(0, 10)
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const postData = (e) => {
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_API_URL}/todos`, data)
      .then(res => {
        if (res.status === 200) {
          console.log('success')
          setShowModal(false)
          getData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const putData = (e) => {
    e.preventDefault()
    axios.put(`${process.env.REACT_APP_API_URL}/todos/${task.id}`, data)
      .then(res => {
        if (res.status === 200) {
          console.log('success')
          setShowModal(false)
          getData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }


  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='form-title-container'>
          <h3>{mode} a task</h3>
          <button onClick={() => {setShowModal(false)}}>X</button>
        </div>
        <form>
          <input
            required={true}
            maxLength={30}
            placeholder='Task title'
            name='title'
            value={data.title}
            onChange={handleChange}
          /> <br />
          <label for='range'>drag to select your current progress</label>
          <input
            type='range'
            min='0'
            max='100'
            name='progress'
            value={data.progress}
            onChange={handleChange}
          />
          <input
            className={mode}
            type='submit'
            onClick={editMode ? putData : postData}
          />
        </form>


      </div>
    </div>
  )
}

export default Modal