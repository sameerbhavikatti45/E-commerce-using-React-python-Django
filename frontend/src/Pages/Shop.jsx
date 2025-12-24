import React from 'react'
import Navbar from '../Components/Navbar'
import Product from '../Components/Product'
import Footer from '../Components/Footer'
export default function Shop() {
  return (
    <div>
      <Navbar/>
      <Product showtitle={false}/>
      <Footer/>
    </div>
  )
}
