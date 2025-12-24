import React from 'react'
import Navbar from '../Components/Navbar'
import Banner from '../Components/Banner'
import Product from '../Components/Product'
import Footer from '../Components/Footer'
export default function Home() {
  return (
    <>
      <Navbar/>
      <Banner/>
      <Product showtitle={true}/>
      <Footer/>
    </>
  )
}
