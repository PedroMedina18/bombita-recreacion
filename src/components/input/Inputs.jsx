import "./input.css";
import "../button/button.css"
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import perfil from "../../assets/perfil.png"
import { activeTooltip } from "../../utils/process.jsx"
import MakeAnimated from "react-select/animated";
import { Tooltip } from "bootstrap"
import { useEffect, useState } from "react";
import { IconCircleCheck, IconCircleX, IconUserCircleSolid } from "../Icon";


export function InputsGeneral({ label, id, type, name, form, placeholder = "", params = {}, flexRow = false, isError = true, needErrors = true, ...props }) {
  const { errors, register } = form;

  if (flexRow) {
    return (
      <div className={`w-100 d-flex flex-column ${errors[name] && isError ? "error" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <label className="formulario-label w-50" htmlFor={id}>
            {label}
          </label>
          <div className="formulario-grupo-input">
            <input
              className={`formulario-input${(type === "date" || type === "datetime-local") ? "-date" : ""} ${needErrors && "pe-2"}`}
              type={type}
              id={id}
              placeholder={placeholder}
              {...register(name, params)}
              {...props}
            />
            <IconCircleCheck className="bi bi-check-circle-fill" />
            <IconCircleX className="bi bi-x-circle-fill" />
          </div>
        </div>
        {
          isError &&
          <p className="formulario-message-error mb-2 ms-auto d-inline-block">
            {errors[name] ? errors[name].message : "error"}
          </p>
        }
      </div>
    );
  } else {
    return (
      <div className={`w-100 d-flex flex-column justify-content-center  ${errors[name] && isError ? "error" : " "}`}>
        <label className="formulario-label" htmlFor={id}>
          {label}
        </label>
        <div className={`formulario-grupo-input ${(type === "date" || type === "datetime-local") ? "date" : ""} `}>
          <input
            className={`formulario-input${(type === "date" || type === "datetime-local") ? "-date" : ""} ${needErrors && "pe-2"}`}
            placeholder={placeholder}
            type={type}
            id={id}
            {...register(name, params)}
            {...props}
          />
          {
            needErrors &&
            <>
              <IconCircleCheck className="bi bi-check-circle-fill" />
              <IconCircleX className="bi bi-x-circle-fill" />
            </>
          }
        </div>
        {
          needErrors &&
          <p className="formulario-message-error">
            {errors[name] ? errors[name].message : "error"}
          </p>
        }
      </div>
    );
  }
}

export function InputTextTarea({ label, id, name, form, placeholder = "", params = {}, rows = null, ...props }) {
  const { errors, register } = form;
  return (
    <div className={`w-100 mb-1 ${errors[name] ? "error" : " "}`}>
      <label className="formulario-label" htmlFor={id}>
        {label}
      </label>
      <div className="formulario-grupo-input textarea ">
        <textarea
          className="formulario-textarea"
          rows={rows ? rows : 4}
          id={id}
          placeholder={placeholder}
          {...register(name, params)}
          {...props}
        />
        <IconCircleCheck className="bi bi-check-circle-fill" />
        <IconCircleX className="bi bi-x-circle-fill" />
      </div>
      <p className="formulario-message-error">
        {errors[name] ? errors[name].message : "error"}
      </p>
    </div>
  );
}

export function InputCheckRadio({ label, id, name, form, params = {}, isError = true, className = "", type = "", ...props }) {
  const { errors, register } = form
  const typeInput = type === "radio" ? "radio" : "checkbox"
  return (
    <div
      className={`w-max-content d-flex check ${errors[name] && isError ? "error" : " "
        } ${className}`}
    >
      <input
        className="form-check-input"
        type={typeInput}
        id={id}
        name={name}
        {...register(name, params)}

        {...props}
      />
      <label className="formulario-label ms-4 " htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export function InputDuration({ label, id, name, form, params = {}, isError = true, ...props }) {
  const { errors, register } = form;
  const hours = [
    { value: 0, label: "00" },
    { value: 1, label: "01" },
    { value: 2, label: "02" },
    { value: 3, label: "03" },
    { value: 4, label: "04" },
    { value: 5, label: "05" },
    { value: 6, label: "06" },
    { value: 7, label: "07" },
    { value: 8, label: "08" },
    { value: 9, label: "09" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
    { value: 19, label: "19" },
    { value: 20, label: "20" },
    { value: 21, label: "21" },
    { value: 22, label: "22" },
    { value: 23, label: "23" },
    { value: 24, label: "24" },
  ];
  const minutes = [
    { value: 0, label: "00" },
    { value: 1, label: "01" },
    { value: 2, label: "02" },
    { value: 3, label: "03" },
    { value: 4, label: "04" },
    { value: 5, label: "05" },
    { value: 6, label: "06" },
    { value: 7, label: "07" },
    { value: 8, label: "08" },
    { value: 9, label: "09" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
    { value: 19, label: "19" },
    { value: 20, label: "20" },
    { value: 21, label: "21" },
    { value: 22, label: "22" },
    { value: 23, label: "23" },
    { value: 24, label: "24" },
    { value: 25, label: "25" },
    { value: 26, label: "26" },
    { value: 27, label: "27" },
    { value: 28, label: "28" },
    { value: 29, label: "29" },
    { value: 30, label: "30" },
    { value: 31, label: "31" },
    { value: 32, label: "32" },
    { value: 33, label: "33" },
    { value: 34, label: "34" },
    { value: 35, label: "35" },
    { value: 36, label: "36" },
    { value: 37, label: "37" },
    { value: 38, label: "38" },
    { value: 39, label: "39" },
    { value: 40, label: "40" },
    { value: 41, label: "41" },
    { value: 42, label: "42" },
    { value: 43, label: "43" },
    { value: 44, label: "44" },
    { value: 45, label: "45" },
    { value: 46, label: "46" },
    { value: 47, label: "47" },
    { value: 48, label: "48" },
    { value: 49, label: "49" },
    { value: 50, label: "50" },
    { value: 51, label: "51" },
    { value: 52, label: "52" },
    { value: 53, label: "53" },
    { value: 54, label: "54" },
    { value: 55, label: "55" },
    { value: 56, label: "56" },
    { value: 57, label: "57" },
    { value: 58, label: "58" },
    { value: 59, label: "59" },
    { value: 60, label: "60" },
  ];

  return (
    <div
      className={`w-100  ${(errors[`${name}-hours`] || errors[`${name}-minutes`]) && isError
        ? "error"
        : " "
        } `}
    >
      <label className="formulario-label" htmlFor={`${id}-hour`}>
        {label}
      </label>
      <div className="d-flex align-items-center justify-content-center">
        <div className="w-50 ">
          <div className="formulario-grupo-input select">
            <select
              name={`${name}-hours`}
              id={`${id}-hours`}
              className="w-100 me-2 formulario-input"
              {...register(`${name}-hours`, params)}
              {...props}
            >
              <option value="">{"..."}</option>
              {hours.map((element) => (
                <option key={element.value} value={element.value}>
                  {element.label}
                </option>
              ))}
            </select>
            <IconCircleX className="bi bi-x-circle-fill" />
          </div>
          <p className="formulario-message-error">
            {errors[`${name}-hours`]
              ? errors[`${name}-hours`].message
              : "error"}
          </p>
        </div>
        <div className="w-50 ">
          <div className="formulario-grupo-input select">
            <select
              name={`${name}-minutes`}
              id={`${id}-minutes`}
              className="w-100 ms-2 formulario-input"
              {...register(`${name}-minutes`, params)}
              {...props}
            >
              <option value="">{"..."}</option>
              {minutes.map((element) => (
                <option key={element.value} value={element.value}>
                  {element.label}
                </option>
              ))}
            </select>
            <IconCircleX className="bi bi-x-circle-fill" />
          </div>

          <p className="formulario-message-error">
            {errors[`${name}-minutes`]
              ? errors[`${name}-minutes`].message
              : "error"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function UnitSelect({ label, id, name, form, params = {}, options, placeholder = "...", isError = true, needErrors = true, ...props }) {
  const { errors, register } = form;
  return (
    <div className={`w-100 d-flex flex-column justify-content-center ${errors[name] && isError ? "error" : " "}`}>
      <label className="formulario-label" htmlFor={id}>
        {label}
      </label>
      <div className="formulario-grupo-input select">
        <select
          name={name}
          id={id}
          className={`formulario-input select ${needErrors && "pe-2"}`}
          {...register(name, params)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.length
            ? options.map((element, index) => (
              <option key={`element.label-${index}`} value={element.value}>
                {element.label}
              </option>
            ))
            : ""}
        </select>
        {
          needErrors &&
          <IconCircleX className="bi bi-x-circle-fill" />
        }
      </div>
      {
        needErrors &&
        <p className="formulario-message-error">
          {errors[name] ? errors[name].message : "error"}
        </p>
      }
    </div>
  );
}

const animatedComponent = MakeAnimated();
export function MultiSelect({ id, label, options, save, placeholder, optionsDefault }) {
  return (
    <div className="w-100">
      <label className="formulario-label" htmlFor={id}>
        {label}
      </label>
      <Select
        id={id}
        isMulti
        options={options}
        components={animatedComponent}
        closeMenuOnSelect={false}
        defaultValue={optionsDefault}
        placeholder={placeholder}
        styles={{
          control: (styles) => {
            return {
              ...styles,
              borderColor: "rgb(22, 21, 21)",
              borderWidth: "1px",
              borderRadius: "2px",
            };
          },
        }}
        captureMenuScroll={true}
        noOptionsMessage={() => {
          return "Sin Opciones";
        }}
        onChange={(selectecOptions) => {
          save(selectecOptions);
        }}
      />
    </div>
  );
}

export function SelectAsync({ id, label = null, optionsDefault, placeholder, loadOptions, value, setValue, getOptionLabel, getOptionValue, onChange = () => { } }) {
  const handleOnChange = (e) => {
    onChange(e)
    setValue(e)
  }
  return (
    <div>
      {
        label &&
        <label className="formulario-label" htmlFor={id}>
          {label}
        </label>
      }
      <AsyncSelect
        cacheOptions
        defaultOptions={optionsDefault}
        value={value}
        loadOptions={loadOptions}
        onChange={handleOnChange}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        placeholder={placeholder}
        id={id}
        noOptionsMessage={() => {
          return "Sin Opciones";
        }}
        loadingMessage={() => {
          return "Buscando";
        }}
      />
    </div>
  )
}

export function InputImgPerfil({ label, id, name, form, tamaño = "lg", imgPerfil = null, disabled = false }) {
  const { errors, register } = form;
  const img = imgPerfil ? imgPerfil : perfil

  const cambio_imagen = (e) => {
    const $IMG = document.getElementById("img-perfil-creador")
    const $SvgPerfil = document.getElementById("svg-perfil")
    const $sectionPerfil = document.getElementById("sectionPerfil")
    if (e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (response) => {
        $IMG.src = response.target.result
        if (!imgPerfil) {
          $IMG.classList.remove("d-none")
          $SvgPerfil.classList.add("d-none")
          $sectionPerfil.classList.add("section-perfil-img")
        }

      }
      reader.readAsDataURL(e.target.files[0])

    } else {
      $IMG.src = img
      if (!imgPerfil) {
        $IMG.classList.add("d-none")
        $SvgPerfil.classList.remove("d-none")
        $sectionPerfil.classList.remove("section-perfil-img")
      }

    }
  }

  return (
    <div className={`w-100 d-flex flex-column align-items-center justify-content-center ${errors[name] && isError ? "error" : " "}`}>
      <div className={`${tamaño == "sm" ? 'sm' : 'lg'} section-perfil d-flex align-items-center justify-content-center ${imgPerfil ? "section-perfil-img" : ""}`} id="sectionPerfil">
        <IconUserCircleSolid id="svg-perfil" className={`${imgPerfil ? "d-none" : ""}`} />
        <img id="img-perfil-creador" src={img} alt="img_perfil" className={`${tamaño == "sm" ? 'sm' : 'lg'} img-perfil ${imgPerfil ? "" : "d-none"}`} />
      </div>
      <label className="button-initial cursor-pointer" htmlFor={name} disabled={disabled}>
        {label}
      </label>
      <input type="file" className="d-none" id={id} name={name} accept=".jpg, .jpeg, .png" multiple={false} disabled={disabled}
        {...register(name)}
        onChange={(e) => { cambio_imagen(e) }}
      />

      <p className="formulario-message-error">
        {errors[name] ? errors[name].message : "error"}
      </p>
    </div>
  )
}

export function InputFile({ label, id, name, form, onChange = () => { }, }) {
  const { errors, register } = form;
  const [img, setImage] = useState({ state: false, nombre: "Sin imagen" })

  const cambio_imagen = (e) => {
    onChange(e)
    if (e.target.files[0]) {
      setImage({
        ...img,
        state: true,
        nombre: e.target.files[0].name
      })
    } else {
      setImage({
        ...img,
        state: false,
        nombre: "Sin imagen"
      })
    }
  }

  return (
    <div className={`w-100 d-flex flex-column align-items-center justify-content-center ${errors[name] && isError ? "error" : " "}`}>
      {
        <div className="container-icon-file">
          {
            img.state ?
              (
                <IconCircleCheck />
              ) :
              (
                <IconCircleX />
              )
          }
          <p className="m-0 fs-7 fw-bold mb-1">{img.nombre}</p>
        </div>
      }
      <label className="button-initial cursor-pointer" htmlFor={name}>
        {label}
      </label>
      <input type="file" className="d-none" id={id} name={name} accept=".jpg, .jpeg, .png" multiple={false}
        {...register(name)}
        onChange={(e) => { cambio_imagen(e) }}
      />

      <p className="formulario-message-error">
        {errors[name] ? errors[name].message : "error"}
      </p>
    </div>
  )
}

export function MoneyInput({ label, id, name, form, params = {}, flexRow = false, isError = true, onChange = () => { }, ...props }) {
  const [value, setValueMoney] = useState('0.00');
  const { errors, register, setValue } = form;

  const handleChange = (event) => {
    onChange(event)
    const inputValue = event.target.value.replace(/[^\d]/g, ''); // allow only digits
    let formattedValue = '0.00';
    let integerPart = '';
    let decimalPart = '';

    // separate integer and decimal parts
    if (inputValue.length > 2) {
      integerPart = inputValue.slice(0, -2);
      decimalPart = inputValue.slice(-2);
    } else {
      decimalPart = inputValue;
    }

    // format integer part
    integerPart = integerPart.replace(/^0/, ''); // remove leading zeros
    if (integerPart === '') {
      integerPart = '0';
    }

    // combine integer and decimal parts
    if (decimalPart) {
      formattedValue = `${integerPart}.${decimalPart}`;
    } else {
      formattedValue = `${integerPart}.00`;
    }

    // update state and input value
    setValue(`${name}`, formattedValue);

    // move cursor to the end of the input field
    const cursorPosition = formattedValue.length;
    event.target.setSelectionRange(cursorPosition, cursorPosition);
  }

  const setSelectionRange = (e) => {
    const texto = e.target.value
    e.target.setSelectionRange(texto.length, texto.length);
  }

  if (flexRow) {
    return (
      <div className={`w-100 d-flex flex-column ${errors[name] && isError ? "error" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <label className="formulario-label w-50" htmlFor={id}>
            {label}
          </label>
          <div className="formulario-grupo-input">
            <input
              className="formulario-input text-right"
              type="text"
              id={id}
              defaultValue={'0.00'}
              {...register(name, params)}
              {...props}
              onChange={handleChange}
              onFocus={setSelectionRange}
              onClick={setSelectionRange}
            />
            <IconCircleCheck className="bi bi-check-circle-fill" />
            <IconCircleX className="bi bi-x-circle-fill" />
          </div>
        </div>
        <p className="formulario-message-error mb-2 ms-auto d-inline-block">
          {errors[name] ? errors[name].message : "error"}
        </p>
      </div>
    );
  } else {
    return (
      <div className={`w-100 ${errors[name] && isError ? "error" : " "}`}>
        <label className="formulario-label" htmlFor={id}>
          {label}
        </label>
        <div className={`formulario-grupo-input`}>
          <input
            className="formulario-input text-right"
            type="text"
            id={id}
            defaultValue={'0.00'}
            {...register(name, params)}
            {...props}
            onChange={handleChange}
            onFocus={setSelectionRange}
            onClick={setSelectionRange}
          />
          <IconCircleCheck className="bi bi-check-circle-fill" />
          <IconCircleX className="bi bi-x-circle-fill" />
        </div>
        <p className="formulario-message-error">
          {errors[name] ? errors[name].message : "error"}
        </p>
      </div>
    );
  }
}

export function TogleSwiches({ id, name, form, className = "", title=null, ...props }) {
  const { errors, register } = form;

  useEffect(() => {
    const tooltipElements = document.querySelectorAll('div.tooltip.custom-tooltip.bs-tooltip-auto.fade.show');
    tooltipElements.forEach((element) => {
      element.remove()
    });
    activeTooltip()
  }, [title])
  
  return (
    <label className={`switch ${className}`}>
      <input className="switch-input" type="checkbox" id={id}
        {...register(name)}
        {...props}
      />
      <span className="slider"
      data-bs-toggle={"tooltip"} data-bs-placement="top"
      data-bs-custom-class="custom-tooltip"
      data-bs-trigger="hover"
      data-bs-title={title}
      ></span>
    </label>
  )
}

export function RadioStart({ save, state, index, id, name, check, block=false }) {
  const [value, setValue]=useState(Number(check))

  return (
    <div className="rating">
      <input type="radio" id={`${name}-star-1`} name={name} value={5} checked={5 === value}
        onChange={(e) => {
          if(block){
            return
          }
          const list = [...state]
          list[index] = { id: id, value: Number(e.target.value) }
          save(list)
          setValue(Number(e.target.value))
        }} />
      <label htmlFor={`${name}-star-1`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
      </label>
      <input type="radio" id={`${name}-star-2`} name={name} value={4} checked={4 === value}
        onChange={(e) => {
          if(block){
            return
          }
          const list = [...state]
          list[index] = { id: id, value: Number(e.target.value) }
          save(list)
          setValue(Number(e.target.value))
        }} />
      <label htmlFor={`${name}-star-2`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
      </label>
      <input type="radio" id={`${name}-star-3`} name={name} value={3} checked={3 === value}
        onChange={(e) => {
          if(block){
            return
          }
          const list = [...state]
          list[index] = { id: id, value: Number(e.target.value) }
          save(list)
          setValue(Number(e.target.value))
        }} />
      <label htmlFor={`${name}-star-3`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
      </label>
      <input type="radio" id={`${name}-star-4`} name={name} value={2} checked={2 === value}
        onChange={(e) => {
          if(block){
            return
          }
          const list = [...state]
          list[index] = { id: id, value: Number(e.target.value) }
          save(list)
          setValue(Number(e.target.value))
        }} />
      <label htmlFor={`${name}-star-4`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
      </label>
      <input type="radio" id={`${name}-star-5`} name={name} value={1} checked={1 === value}
        onChange={(e) => {
          if(block){
            return
          }
          const list = [...state]
          list[index] = { id: id, value: Number(e.target.value) }
          save(list)
          setValue(Number(e.target.value))
        }} />
      <label htmlFor={`${name}-star-5`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
      </label>
    </div>


  )
}