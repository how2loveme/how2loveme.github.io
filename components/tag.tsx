'use client'

import { FaXmark } from 'react-icons/fa6'
import { memo } from 'react'
import _ from 'lodash'

const colorList: (
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
)[] = ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink']
const getRandomColor = () => {
  return colorList[Math.floor(Math.random() * 1000) % colorList.length]
}
const theme = {
  gray: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
  purple: 'bg-purple-50 text-purple-700 ring-purple-700/10',
  pink: 'bg-pink-50 text-pink-700 ring-pink-700/10',
}

const Tag = ({
  label,
  color = 'blue',
  icon,
  random = false,
  onClick,
}: {
  label: string
  color?:
    | 'gray'
    | 'red'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
  icon?: 'xmark'
  random?: boolean
  onClick?: Function
}) => {
  const fnSVGClick = (e) => {
    if (onClick) {
      onClick(label)
    }
  }
  return (
    <span
      className={[
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        theme[random ? getRandomColor() : color],
      ].join(' ')}
    >
      {label}
      {icon === 'xmark' && (
        <FaXmark className={'cursor-pointer'} onClick={fnSVGClick} />
      )}
    </span>
  )
}
const equalCamparison = (prevProps, nextProps) => {
  return _.isEqual(prevProps.label, nextProps.label)
}

export default memo(Tag, equalCamparison)
