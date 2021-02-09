import React, { useEffect, useRef } from 'react'


/**
 * This is a custom fix for a react-related problem that useEffect hooks 
 * get fired on initial load, even if you don't want them to do.
 * @param {*} fn The callback function that get's executed
 * @param {*} inputs The data to watch.
 * @see https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render/53180013#53180013
 */
export default function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current)
      fn()
    else
      didMountRef.current = true
  }, inputs)
}