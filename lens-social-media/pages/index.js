import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import Profile from '../components/Profile'

export default function Home() {
  

  

  return (
    <div className={styles.container}>
      <Navbar />
      <Profile />
    </div>
  )
}
