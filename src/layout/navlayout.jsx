import Navbar from "../components/navbar"
import Footer from '../components/footer'

export default function navlayout({children}) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}
