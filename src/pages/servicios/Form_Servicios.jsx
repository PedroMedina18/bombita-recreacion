import { useState, useEffect,useRef } from "react";
import { Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { recreadores, servicios, materiales, actividades, } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { ButtonSimple } from "../../components/button/Button";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { InputsGeneral, InputTextTarea, InputDuration, MultiSelect } from "../../components/input/Inputs.jsx";
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import Navbar from "../../components/navbar/Navbar";
import Swal from "sweetalert2";
import {IconRowLeft} from "../../components/Icon"

function Form_Servicios() {
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const [dataRecreadores, setDataRecreadores] = useState([]);
  const [dataMateriales, setDataMateriales] = useState([]);
  const [dataActividades, setDataActividades] = useState([]);
  const [saveRecreadores, setSaveRecreadores] = useState([]);
  const [saveMateriales, setSaveMateriales] = useState([]);
  const [saveActividades, setSaveActividades] = useState([]);
  const [submit, setSubmit] = useState(false);
  const renderizado = useRef(0)
  const navigate = useNavigate();

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, []);

  //* funcion para buscar los permisos en la vase de datos
  const get_data = async () => {
    try {
      const getRecreadores = await recreadores.get();
      const getMateriales = await materiales.get();
      const getActividades = await actividades.get();
      verifyOptionsSelect({
        respuesta: getRecreadores,
        setError: setErrorServer,
        setOptions: setDataRecreadores,
      });
      verifyOptionsSelect({
        respuesta: getMateriales,
        setError: setErrorServer,
        setOptions: setDataMateriales,
      });
      verifyOptionsSelect({
        respuesta: getActividades,
        setError: setErrorServer,
        setOptions: setDataActividades,
      });
    } catch (error) {
      console.log(error);
      setErrorServer(texts.errorMessage.errorSystem);
    } finally {
      setLoading(false);
    }
  };

  //* the useform
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (
        !saveRecreadores.length ||
        !saveMateriales.length ||
        !saveActividades.length
      ) {
        return;
      }
      const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirRegister);
      if (!confirmacion) {
        return;
      }
      const recreadores = saveRecreadores.map((elements) => {
        return elements.value;
      });
      const actividades = saveActividades.map((elements) => {
        return elements.value;
      });
      const materiales = saveMateriales.map((elements) => {
        return {
          material: elements.value,
          cantidad: data[`${elements.label}`],
        };
      });
      const body = {
        nombre: data.nombre,
        precio: parseFloat(data.precio),
        numero_recreadores: Number(data.numero_recreadores),
        descripcion: data.descripcion,
        duracion: {
          horas: Number(data["duracion-hours"]),
          minutos: Number(data["duracion-minutes"]),
        },
        recreadores: recreadores,
        actividades: actividades,
        materiales: materiales,
      };
      alertLoading("Cargando")
      const res = await servicios.post(body);
      controlResultPost({
        respuesta: res,
        messageExito: texts.successMessage.servicios,
        useNavigate: { navigate: navigate, direction: "/servicios" },
      });
    } catch {
      console.log(error);
      Swal.close();
      toastError(texts.errorMessage.errorConexion);
    }
  });

  return (
    <Navbar
      name={texts.pages.registerServicio.name}
      descripcion={texts.pages.registerServicio.description}
    >
      <ButtonSimple type="button"  className="mb-3"
        onClick={() => {
          navigate("/servicios");
        }}
      >
        <IconRowLeft/>
        Regresar
      </ButtonSimple>

      {loading ?
        (
          <div className="div-main justify-content-center p-4">
            <LoaderCircle />
          </div>
        )
        : errorServer ?
          (
            <div className="div-main justify-content-center p-4">
              <ErrorSystem error={errorServer} />
            </div>
          )
          :
          (
            <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
              <form className="w-100 d-flex flex-column" onSubmit={onSubmit}>
                <InputsGeneral
                  type={"text"}
                  id="nombre"
                  label={texts.label.nombre}
                  name="nombre"
                  form={{ register, errors }}
                  params={{
                    required: {
                      value: true,
                      message: texts.inputsMessage.requireName,
                    },
                    maxLength: {
                      value: 100,
                      message: texts.inputsMessage.max50,
                    },
                    validate: (value) => {
                      if (hasLeadingOrTrailingSpace(value)) {
                        return texts.inputsMessage.noneSpace;
                      } else {
                        return true;
                      }
                    },
                  }}
                  placeholder={"Nombre del Servicio"}
                />
                <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="w-md-30 w-100">
                    <InputDuration
                      id="duracion"
                      label={texts.label.duracion}
                      name="duracion"
                      form={{ register, errors }}
                      params={{
                        validate: (value) => {
                          if (value === "") {
                            return texts.inputsMessage.selectValor;
                          } else {
                            return true;
                          }
                        },
                      }}
                    />
                  </div>
                  <div className="w-md-30 w-100">
                    <InputsGeneral
                      type={"number"}
                      label={texts.label.recreadores}
                      name="numero_recreadores"
                      id="numero_recreadores"
                      form={{ errors, register }}
                      params={{
                        required: {
                          value: true,
                          message: texts.inputsMessage.requireRecreadores,
                        },
                        min: {
                          value: 1,
                          message: texts.inputsMessage.minRecreador,
                        },
                      }}
                      defaultValue={1}
                      placeholder={1}
                    />
                  </div>
                  <div className="w-md-25 w-100">
                    <InputsGeneral
                      type={"number"}
                      label={texts.label.precio}
                      name="precio"
                      id="precio"
                      form={{ errors, register }}
                      params={{
                        required: {
                          value: true,
                          message: texts.inputsMessage.requirePrecio,
                        },
                        validate: (e) => {
                          if (e <= 0) {
                            return texts.inputsMessage.minPrecio;
                          } else {
                            return true;
                          }
                        },
                      }}
                      defaultValue={0}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="mb-1">
                  <MultiSelect
                    name="recreadores-servicio"
                    label={`${texts.label.recreadoresPermitidos}`}
                    id="recreadores-servicio"
                    options={dataRecreadores}
                    save={setSaveRecreadores}
                    placeholder={"Recreadores"}
                  />
                  {Boolean(!saveRecreadores.length && submit) ? (
                    <span className="message-error visible">
                      {texts.inputsMessage.selectRecreadores}
                    </span>
                  ) : (
                    <span className="message-error invisible">Sin errores</span>
                  )}
                </div>
                <div className="mb-1">
                  <MultiSelect
                    name="actividades"
                    label={`${texts.label.actividades}`}
                    id="actividades"
                    options={dataActividades}
                    save={setSaveActividades}
                    placeholder={"Activiades que se realizan"}
                  />
                  {Boolean(!saveActividades.length && submit) ? (
                    <span className="message-error visible">
                      {texts.inputsMessage.selectActividades}
                    </span>
                  ) : (
                    <span className="message-error invisible">Sin errores</span>
                  )}
                </div>
                <div className="mb-1">
                  <MultiSelect
                    name="materiales"
                    label={`${texts.label.materiales}`}
                    id="materiales"
                    options={dataMateriales}
                    save={setSaveMateriales}
                    placeholder={"Materiales que se necesitan"}
                  />
                  {Boolean(!saveMateriales.length && submit) ? (
                    <span className="message-error visible">
                      {texts.inputsMessage.selectMateriales}
                    </span>
                  ) : (
                    <span className="message-error invisible">Sin errores</span>
                  )}
                </div>
                {saveMateriales.length ? (
                  <div>
                    <h4 className="fw-bold h5 mb-2">
                      Escoja la cantidad de materiales
                    </h4>
                    {saveMateriales.map((element, index) => (
                      <InputsGeneral
                        type={"number"}
                        key={`${element.label}-${index}`}
                        name={element.label}
                        label={element.label}
                        id={`${element.value}-material`}
                        form={{ errors, register }}
                        flexRow={true}
                        params={{
                          required: {
                            value: true,
                            message: texts.inputsMessage.requireCantidadMaterial,
                          },
                          min: {
                            value: 0,
                            message: texts.inputsMessage.minNegative,
                          },
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  ""
                )}
                <InputTextTarea
                  label={texts.label.descripcion}
                  name="descripcion"
                  id="descripcion"
                  form={{ errors, register }}
                  params={{
                    maxLength: {
                      value: 500,
                      message: texts.inputsMessage.max500,
                    },
                    validate: (value) => {
                      if (hasLeadingOrTrailingSpace(value)) {
                        return texts.inputsMessage.noneSpace;
                      } else {
                        return true;
                      }
                    },
                  }}
                  placeholder={texts.placeholder.descripcion}
                />
                <ButtonSimple
                  onClick={(e) => {
                    setSubmit(true);
                  }}
                  type="submit"
                  className="mx-auto w-50 mt-3"
                >
                  Registrar
                </ButtonSimple>
              </form>
            </div>
          )}
      <Toaster />
    </Navbar>
  );
}

export default Form_Servicios;
