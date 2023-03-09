import React, { useEffect, useState } from 'react';
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import Auth from './components/Auth';
import './index.css'
import axios from 'axios';
import { useCookies } from 'react-cookie';

function App() {

  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email
  const authToken = cookies.Token
  const [tasks, setTasks] = useState(null)


  const getData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/todos/${userEmail}`)
      .then((response) => {
        console.log(response.data)
        setTasks(response.data)
      }).catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, [])

  //sort tasks by progress amount 
  const sortedTasks = tasks?.sort((a, b) => {
    return b.progress - a.progress
  })

  return (
    <div className="App">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <ListHeader listName={'Vacation List'} getData={getData} />
          <span style={{ fontStyle: 'italic' }}>signed in as {cookies.Email}</span>
          <span style={{ fontStyle: 'italic', float: 'right'}}>tasks ordered by progress amount</span>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>}
    </div>
  );
}

export default App;
