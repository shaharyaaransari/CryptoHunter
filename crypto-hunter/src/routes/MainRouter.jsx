import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
  import CoinPage from "../pages/CoinPage"
function MainRouter() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/coins/:id' element={<CoinPage/>}/>
        </Routes>
    </div>
  )
}

export default MainRouter