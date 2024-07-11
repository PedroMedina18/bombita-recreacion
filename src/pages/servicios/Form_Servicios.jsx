import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { servicios, materiales, actividades, } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { ButtonSimple } from "../../components/button/Button";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { InputsGeneral, InputTextTarea, InputDuration, MultiSelect, MoneyInput } from "../../components/input/Inputs.jsx";
import { hasLeadingOrTrailingSpace, coincidences, normalizeDecimalNumber } from "../../utils/process.jsx";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import Navbar from "../../components/navbar/Navbar";
import Swal from "sweetalert2";
import { IconRowLeft } from "../../components/Icon"

function Form_Servicios() {
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const [dataMateriales, setDataMateriales] = useState([]);
  const [dataActividades, setDataActividades] = useState([]);
  const [dataMaterialesDefault, setDataMaterialesDefault] = useState([]);
  const [dataActividadesDefault, setDataActividadesDefault] = useState([]);
  const [saveMateriales, setSaveMateriales] = useState([]);
  const [saveActividades, setSaveActividades] = useState([]);
  const [submit, setSubmit] = useState(false);
  const renderizado = useRef(0)
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, []);

  useEffect(() => {
    if (dataMateriales.length && dataActividades.length) {
      if (params.id) {
        get_servicio()
      }
    }
  }, [dataMateriales, dataActividades])

  //* funcion para buscar los permisos en la vase de datos
  const get_data = async () => {
    try {
      const getMateriales = await materiales.get({});
      const getActividades = await actividades.get({});
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
      if (!params.id) {
        setLoading(false)
      }
    }
  };

  const get_servicio = async () => {
    try {
      const respuesta = await servicios.get({ paramOne: Number(params.id) })
      if (respuesta.status !== 200) {
        setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
        return
      }
      if (respuesta.data.status === false) {
        setErrorServer(`${respuesta.data.message}`)
        return
      }
      setErrorServer("")
      if (respuesta.data.data.permisos) {
        setOptionsDefault(coincidences(options, respuesta.data.data.permisos))
        setSelectOptions(coincidences(options, respuesta.data.data.permisos))
      }
      setValue("nombre", respuesta.data.data.nombre)
      setValue("precio", normalizeDecimalNumber(respuesta.data.data.precio))
      setValue("descripcion", respuesta.data.data.descripcion)
      setValue("duracion-hours", respuesta.data.data.duracion.horas),
      setValue("duracion-minutes", respuesta.data.data.duracion.minutos),
      setSaveActividades(coincidences(dataActividades, respuesta.data.data.actividades))
      setDataActividadesDefault(coincidences(dataActividades, respuesta.data.data.actividades))
      setSaveMateriales(coincidences(dataMateriales, respuesta.data.data.materiales))
      setDataMaterialesDefault(coincidences(dataMateriales, respuesta.data.data.materiales))
      respuesta.data.data.materiales.forEach(element => {
        setValue(`${element.nombre}`, element.cantidad)
      });
    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorObjet)
    } finally {
      setLoading(false)
    }
  }

  //* the useform
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!saveMateriales.length || !saveActividades.length) {
        return;
      }
      const message = params.id ? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
      const confirmacion = await alertConfim("Confirmar", message);
      if (!confirmacion) {
        return;
      }
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
        actividades: actividades,
        materiales: materiales,
      };
      alertLoading("Cargando")
      const res = params.id ? await servicios.put(body, Number(params.id)) : await servicios.post(body);
      controlResultPost({
        respuesta: res,

        messageExito: params.id ? texts.successMessage.editionServicio : texts.successMessage.registerServicio,
        useNavigate: { navigate: navigate, direction: "/servicios" },
      });
    } catch {
      console.log(error);
      Swal.close();
      toastError(texts.errorMessage.errorConexion);
    }
  });

  return (
    <Navbar name={params.id ? texts.pages.editServicio.name : texts.pages.registerServicio.name} descripcion={params.id ? texts.pages.editServicio.description : texts.pages.registerServicio.description}>
      <ButtonSimple type="button" className="mb-3"
        onClick={() => {
          navigate("/servicios");
        }}
      >
        <IconRowLeft />
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
                      message: texts.inputsMessage.max100,
                    },
                    validate: (value) => {
                      if (hasLeadingOrTrailingSpace(value)) {
                        return texts.inputsMessage.noneSpace;
                      } else {
                        return true;
                      }
                    },
                  }}
                  placeholder={texts.placeholder.nameServicio}
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
                    <MoneyInput
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
                          if (e <= "0,00") {
                            return texts.inputsMessage.minPrecio;
                          } else {
                            return true;
                          }
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="mb-1">
                  <MultiSelect
                    name="actividades"
                    label={`${texts.label.actividades}`}
                    id="actividades"
                    options={dataActividades}
                    save={setSaveActividades}
                    placeholder={"Activiades que se realizan"}
                    optionsDefault={dataActividadesDefault}
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
                  <MultiSelect name="materiales" label={`${texts.label.materiales}`} id="materiales" options={dataMateriales} save={setSaveMateriales} placeholder={"Materiales que se necesitan"} optionsDefault={dataMaterialesDefault} />
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
                      <InputsGeneral type={"number"} key={`${element.label}-${index}`} name={element.label} label={element.label} id={`${element.value}-material`} form={{ errors, register }} flexRow={true} params={{
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
                <InputTextTarea label={texts.label.descripcion} name="descripcion" id="descripcion" form={{ errors, register }} params={{
                  required: {
                    value: true,
                    message: texts.inputsMessage.requiredDesription,
                  },
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
                <ButtonSimple className="mx-auto w-50 mt-3" type="submit"
                  onClick={(e) => {
                    setSubmit(true);
                  }}
                >
                  {params.id ? "Guardar" : "Registrar"}
                </ButtonSimple>
              </form>
            </div>
          )}
      <Toaster />
    </Navbar>
  );
}

export default Form_Servicios;
