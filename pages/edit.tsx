import Layout from '../components/layout'
import { useEffect, useReducer, useRef, useState } from 'react'
import loadable from '@loadable/component'

interface postProps {
  subject: string
  category: string
  tags: string[]
  content: string
  save: boolean
}

const Editor = loadable(() => import('../components/editor'))
const Tag = loadable(() => import('../components/tag'))

export default function Edit() {
  const iptSubjectRef = useRef<HTMLInputElement>()
  const selCategoryRef = useRef<HTMLSelectElement>()
  const iptTagsRef = useRef<HTMLInputElement>()
  const editorRef = useRef(null)
  const formRef = useRef<HTMLFormElement>()
  const [mode, setMode] = useState<'insert' | 'modify'>('insert')
  const initialState: postProps = {
    subject: '',
    category: '',
    tags: [],
    content: '',
    save: false,
  }
  const reducer = (state: postProps, action) => {
    let newState = Object.assign({}, state)
    switch (action.type) {
      case 'LOAD':
        newState = Object.assign({}, initialState)
        return newState
      case 'ADDTAG':
        if (
          action.payload.trim() &&
          newState.tags.findIndex((item) => item === action.payload.trim()) ===
            -1
        ) {
          newState.tags.push(action.payload)
        }
        return newState
      case 'REMOVETAG':
        newState.tags = newState.tags.filter(
          (label) => label !== action.payload.trim()
        )
        return newState
      case 'SAVE':
        return Object.assign(newState, { ...action.payload, save: true })
      default:
        throw new Error()
    }
  }
  const [state, dispatch]: [state: postProps, dispatch: any] = useReducer(
    reducer,
    initialState
  )
  useEffect(() => {
    if (state.save) {
      ppp()
    }
  }, [state.save])

  const fnKeyup = (e) => {
    if (e.code === 'Enter') {
      dispatch({ type: 'ADDTAG', payload: e.target.value })
      e.target.value = null
    }
  }
  const fnTagClick = (label: string) => {
    dispatch({ type: 'REMOVETAG', payload: label })
  }
  const fnSave = async (e) => {
    await dispatch({
      type: 'SAVE',
      payload: {
        subject: iptSubjectRef.current.value,
        category: selCategoryRef.current.value,
        content: editorRef.current.getValue(),
      },
    })
    // formRef.current.submit()
  }
  const ppp = async () => {
    const hi = await import('../pages/api/kowaine').then((kowaine) =>
      kowaine.GitPost()
    )
    alert(hi.data['name'])
  }

  return (
    <Layout edit>
      <form onSubmit={fnSave} method="POST" action="/post" ref={formRef}>
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
                      ref={iptSubjectRef}
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
                    ref={selCategoryRef}
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
                      ref={iptTagsRef}
                      onKeyUp={fnKeyup}
                    />
                  </div>
                  {state.tags.length > 0 && (
                    <div className="flex flex-wrap gap-x-3 gap-y-2 my-2">
                      {state.tags.map((item) => {
                        return (
                          <Tag
                            key={item}
                            label={item}
                            icon={'xmark'}
                            onClick={fnTagClick}
                            random
                          />
                        )
                      })}
                    </div>
                  )}
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
                  <Editor className={'min-h-2000'} ref={editorRef} />
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
      </form>
    </Layout>
  )
}
