import { useEffect } from 'react'
import { API } from '../../api_instance'
import { ViewImage } from './ViewImage'
import { useApp } from '../../contexts/AppContext'

export function CloudListImages({ clientId }) {
  const { cloudImages, loading } = useApp()

  useEffect(() => {
    loading.set(true)
    API.getPreviusImgs(clientId)
      .then(({ data }) => {
        cloudImages.set(data.photos)
        loading.set(false)
      })
      .catch((err) => {
        alert(err)
        loading.set(false)
      })
  }, [])

  async function onRemove(id, publicId, name) {
    const res = confirm(`¿Quieres eliminar la imagen ${name}?`)
    if (res) {
      loading.set(true)
      await API.deleteSingleImg({
        publicId: publicId,
        id: id,
      })
      //llamar a la api
      const { data } = await API.getPreviusImgs(clientId)
      cloudImages.set(data.photos)
    }

    loading.set(false)
  }

  if (!cloudImages.size) return null

  return (
    <>
      <h2 className="text-white text-center col-span-2 text-xl p-3 sticky top-0 z-50 bg-main/70 backdrop-blur-sm">
        Imagenes Subidas
      </h2>
      {cloudImages.values.map(({ id, ...image }) => (
        <ViewImage
          key={id}
          {...image}
          inCloud={true}
          onRemove={() => onRemove(id, image.publicId, image.originalName)}
        />
      ))}
    </>
  )
}
