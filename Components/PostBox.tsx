import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutation'
import client from '../apollo-client'
import { GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast, { Toaster } from 'react-hot-toast'
type FormData = {
  postTitle: string
  postBody: string
  postImage: String
  subreddit: string
}
function PostBox() {
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
  const { data: session } = useSession()
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const [addPost] = useMutation(ADD_POST)
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: { topic: formData.subreddit },
      })

      const subredditExists = getSubredditListByTopic.length > 0
      if (!subredditExists) {
        //   Create SubReddit...
        console.log('SubReddit is new! -> Creating new SubReddit...')
        const notification2 = toast.loading('Creating New Sub Reddit...')
        const {
          data: { insertSubReddit: newSubReddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })
        toast.success('New SubReddit Created!', {
          id: notification2,
        })
        toast.dismiss(notification2)
        console.log('Creating post ...', formData)
        const image = formData.postImage || ''
        const notification = toast.loading('Creating New Post...')

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            title: formData.postTitle,
            subreddit_id: newSubReddit.id,
            username: session?.user?.name,
          },
        })
        toast.success('New Post Created!', {
          id: notification,
        })
        console.log('new post added:', newPost)
      } else {
        //   Use Existing Sub Reddit...
        console.log('SubReddit already exists! -> Creating new Post...')
        console.log(getSubredditListByTopic)
        const image = formData.postImage || ''
        const notification = toast.loading('Creating New Post...')

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            title: formData.postTitle,
            subreddit_id: getSubredditListByTopic[0].id,
            username: session?.user?.name,
          },
        })
        toast.success('New Post Created!', {
          id: notification,
        })
        console.log('new post added:', newPost)
      }
      // After the post has been added
      setValue('postTitle', '')
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('subreddit', '')
    } catch (error) {
      toast.error('Whoops!! Something went wrong')
    }
  })
  return (
    <form
      className="sticky top-16 z-50 rounded-md border border-gray-300 bg-white p-2"
      onSubmit={onSubmit}
    >
      <div className="flex items-center space-x-3">
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          type="text"
          disabled={!session}
          className="bg-gray=50 flex-1 rounded-sm p-2 pl-5 outline-none"
          placeholder={
            session
              ? 'Create a Post by entering a Title !!!'
              : 'You are not signed in'
          }
        />
        <PhotographIcon
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && 'text-blue-300'
          }`}
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {!!watch('postTitle') && (
        <div className=" flex flex-col py-2">
          {/* BODY */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              type="text"
              placeholder="Enter Body"
            />
          </div>
          {/* BODY */}

          {/* SubReddit */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Sub Reddit</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('subreddit', { required: true })}
              type="text"
              placeholder="Enter SubReddit (i.e React js)"
            />
          </div>
          {/* SubReddit */}

          {/* ImageBox Open */}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postImage')}
                type="text"
                placeholder="Enter Image URL"
              />
            </div>
          )}
          {/* ImageBox Open */}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>A Post Title is Required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>A Sub Reddit Title is Required</p>
              )}
            </div>
          )}
          {/* Errors */}

          {/* Submit */}
          {!!watch('postTitle') && (
            <button
              className="w-full rounded-full bg-blue-400 p-2 text-white"
              type="submit"
            >
              Create Post{' '}
            </button>
          )}
          {/* Submit */}
        </div>
      )}
    </form>
  )
}

export default PostBox
