"use client"

import { useState, useEffect, useRef } from "react"

type FetchFunction<T> = () => Promise<T>

interface UseRealTimeUpdatesOptions {
  interval?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

export function useRealTimeUpdates<T>(
  fetchFn: FetchFunction<T>,
  initialData: T,
  options: UseRealTimeUpdatesOptions = {},
) {
  const { interval = 10000, enabled = true, onError } = options
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const fetchFnRef = useRef(fetchFn)

  // Update the ref when the fetch function changes
  useEffect(() => {
    fetchFnRef.current = fetchFn
  }, [fetchFn])

  // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const newData = await fetchFnRef.current()
      setData(newData)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Set up polling
  useEffect(() => {
    if (!enabled) return

    // Fetch immediately on mount
    fetchData()

    // Set up interval for polling
    const intervalId = setInterval(fetchData, interval)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [interval, enabled])

  // Function to manually trigger a refresh
  const refresh = () => {
    return fetchData()
  }

  return {
    data,
    setData,
    isLoading,
    error,
    refresh,
  }
}
