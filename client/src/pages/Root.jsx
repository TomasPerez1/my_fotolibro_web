import { Outlet, useLoaderData } from 'react-router-dom'
import { Nav } from '../components/'
import { UrlInUse } from '../components/UrlInUse'
import { useEffect } from 'react'
import { API } from '../api_instance'
import { PreviousNext } from '../components/PreviousNext'
import { SuccessPage } from './SuccessPage'

export function Root() {
  const client = useLoaderData()

  useEffect(() => {
    window.addEventListener('beforeunload', () =>
      API.disconnectClient(client?.id)
    )
    return () => {
      window.removeEventListener('beforeunload', () =>
        API.disconnectClient(client?.id)
      )
    }
  }, [])

  if (!client.active_link) {
    return <SuccessPage />
  }
  return (
    <div className="bg-main min-h-screen">
      {client?.online ? (
        <UrlInUse />
      ) : (
        <>
          <Nav />
          <PreviousNext />
          <Outlet />
        </>
      )}
    </div>
  )
}
