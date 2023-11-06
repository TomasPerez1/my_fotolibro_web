import { PersonalData } from "../client_data";
import { useState } from "react";
import { isValidClient } from "../../utils";
import { useEffect } from "react";
import { API } from "../../api_instance/index";

export function CreateClient() {
  const [client, setClient] = useState();
  const [errs, setErrs] = useState();

  useEffect(() => {
    console.log(client);
  }, [client]);

  function submitClient(e) {
    e.preventDefault()
    API.createClient(client).then(res => console.log(res))
    //API.getClients().then(res => console.log(res))
  }

  return (
    <div>
      <h1 className="text-3xl text-white text-center">
        Complete los campos para crear un cliente con su codigo para cargar
        imagenes
      </h1>
      <form onSubmit={submitClient} className="border-2">
        <PersonalData setClient={setClient} />
        <div className="mx-auto w-fit">
          <button
            type="submit"
            className="rounded bg-white text-blue-500 hover:bg-opacity-70 hover:font-bold border-2 px-4 py-1 my-2 text-xl"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
