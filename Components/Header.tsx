import Image from 'next/image'
import React from 'react'
import {
  ChevronDownIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
} from '@heroicons/react/solid'
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
function Header() {
  const { data: session } = useSession()
  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
      <div className="relative h-12 w-20 flex-shrink-0 cursor-pointer">
        <Image
          src="/assets/images/reddit.png"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className=" mx-7 flex items-center xl:min-w-[130px]">
        <HomeIcon className="h-5 w-5" />
        <p className=" ml-2 hidden flex-1 md:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      {/* Search */}

      <form className="roundend-sm flex flex-1 items-center space-x-2 border border-gray-200 bg-gray-100 px-3 py-1">
        <SearchIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Reddit"
        />
        <button hidden type="submit" />
      </form>
      <div className="  mx-5 flex hidden items-center space-x-2 text-gray-500 md:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="border-gray=100 h-10 border" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center md:hidden">
        <MenuIcon className="icon" />
      </div>
      {session ? (
        <div
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 md:flex"
          onClick={() => signOut()}
        >
          <div className="relative h-8 w-6 flex-shrink-0">
            <Image
              src="/assets/images/signinlogo.png"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-500">Sign Out</p>
          </div>
          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 md:flex"
          onClick={() => signIn()}
        >
          <div className="relative h-8 w-6 flex-shrink-0">
            <Image
              src="/assets/images/signinlogo.png"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-gray-500">Sign in</p>
        </div>
      )}
    </div>
  )
}

export default Header
