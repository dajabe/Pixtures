import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggle, setFalse, setTrue, setState } from '../reducers/loading'

export default function Canvas() {
  const { isLoading } = useSelector((state) => state.loading)
  const dispatch = useDispatch()
  console.log(isLoading)

  useEffect(() => {
    dispatch(setState('youramuppet'))
  }, [])

  return (
    <div className="canvas">
      {isLoading ? <>Loading...</> : <>Poster goes here</>}
    </div>
  )
}
