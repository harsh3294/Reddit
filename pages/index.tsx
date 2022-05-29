import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../Components/Header'
import PostBox from '../Components/PostBox'

const Home: NextPage = () => {
  return (
    <div className="mx-auto my-7 max-w-4xl ">
      <Head>
        <title>Reddit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Post Box */}
      <PostBox />
      {/* Post Box */}
    </div>
  )
}

export default Home
