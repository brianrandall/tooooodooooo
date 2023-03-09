import React from 'react'
import Modal from './Modal'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

const ListHeader = ({ listName, getData }) => {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(null)

  const signOut = () => {
    removeCookie('Token')
    window.location.reload()
    console.log('signing out')
  }

  return (
    <div className='list-header'>
      <h1>{listName}</h1>
      <div className='button-container'>
        <button className='create-button' onClick={() => setShowModal(true)}>
          ADD NEW
        </button>
        <button className='logout-button' onClick={signOut}>
          LOG OUT
        </button>
      </div>
      {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/>}
    </div>
  )
}

export default ListHeader