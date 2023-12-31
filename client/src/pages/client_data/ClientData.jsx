import { PersonalData } from './';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { API } from '../../api_instance';
import { toast } from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';

export function ClientData() {
  const { handleNextStep } = useApp();
  const navigate = useNavigate();
  const _client = useLoaderData();
  const [client, setClient] = useState(_client);
  const [errs, setErrs] = useState({});

  useEffect(() => {
    if (_client.email && _client.dni && _client.phone && _client.id) {
      handleNextStep({ index: 1, access: true });
    } else {
      handleNextStep({ index: 1, access: false });
    }
  }, [client]);

  async function handleSubmit(e) {
    e.preventDefault();
    API.updateClient({ clientId: _client.id, newData: client })
      .then((res) => {
        if (res.data) {
          toast.success('Se cargaron sus datos correctamente');
          navigate(`/client/${_client.id}/upload_images`);
        }
      })
      .catch((e) => {
        toast.error('Error al cargar sus datos');
        console.log(e);
      });
  }

  return (
    <div className="h-full ">
      <h1 className="w-[75%] text-white mx-auto text-center mt-10">
        Complete los siguientes campos con la información requerida
      </h1>
      <form
        className="flex items-center flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <PersonalData
          errs={errs}
          setErrs={setErrs}
          client={client}
          _client={_client}
          setClient={setClient}
        />
        <button
          disabled={
            Object.values(errs)?.length ||
            !client.email ||
            !client.dni ||
            !client.phone
              ? true
              : false
          }
          className="disabled:opacity-40 text-primary bg-white text-3xl p-2 rounded-lg hover:bg-gray-400  border-gray-400"
          type="submit"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
