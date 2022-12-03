import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import CreatePost from '../components/CreatePost'

export default function Home() {
  

  

  return (
    <div className={styles.container}>
      <Navbar />
      <CreatePost />
    </div>
  )
}
