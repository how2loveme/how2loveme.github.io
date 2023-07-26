import Layout from '../components/layout'
import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react'

interface postProps {
  subject: string
  category: string
  tags: string
  content: string
}

const Editor = lazy(() => import('../components/editor'))

// Add a fixed delay so you can see the loading state
const delayForDemo = (promise) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  }).then(() => promise)
}

export default function Edit() {
  const [ready, setReady] = useState<boolean>(false)
  const iptSubject = useRef<HTMLInputElement>()
  const selCategory = useRef<HTMLSelectElement>()
  const iptTags = useRef<HTMLInputElement>()
  const [mode, setMode] = useState<'insert' | 'modify'>('insert')
  const initialState: postProps = {
    subject: '',
    category: '',
    tags: '',
    content: '',
  }
  const reducer = (state: postProps, action) => {
    let newState = Object.assign({}, state)
    switch (action.type) {
      case 'LOAD':
        newState = Object.assign({}, initialState)
        return newState
      default:
        throw new Error()
    }
  }
  const [state, dispatch]: [state: postProps, dispatch: any] = useReducer(
    reducer,
    initialState
  )
  useEffect(() => {
    setReady(!0)
  }, [ready])

  const ref = useRef(null)

  const fnSave = (e) => {
    debugger
    iptSubject.current.value
    selCategory.current.value
    iptTags.current.value
    ref.current
  }
  return (
    <Layout edit>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {mode == 'insert' ? '글쓰기' : '편집하기'}
          </h2>
          <p className="mt-1 pb-10 text-sm leading-6 text-gray-600 border-b">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="subject"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                제목
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    autoComplete="subject"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder=""
                    //value={state.subject}
                    ref={iptSubject}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                분류
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  //value={state.category}
                  ref={selCategory}
                >
                  <option>개발</option>
                  <option>일상</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="tags"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                태그
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    autoComplete="tags"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder=""
                    ref={iptTags}
                  />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2 my-2">
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    Badge
                  </span>
                  <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                    Badge
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="content"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                내용
              </label>
              <div className="mt-2">
                {ready ? <Editor className={'min-h-2000'} ref={ref} /> : <></>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={fnSave}
        >
          Save
        </button>
      </div>
    </Layout>
  )
}
