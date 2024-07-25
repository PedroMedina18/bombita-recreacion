window.addEventListener('beforeunload', function(event) {
    // Your code to be executed before the page is closed
    console.log('Page is about to be closed!');
    // You can also return a string to display a custom message to the user
    return 'Are you sure you want to leave?';
  });



// INACTIVIDAD
let inactivityTimeout = null;
let inactivityDelay = 10 * 60 * 1000; // 10 minutos en milisegundos

function startInactivityTimer() {
  inactivityTimeout = setTimeout(function() {
    console.log('Inactividad detectada!');
    // Ejecuta la función que deseas cuando se detecta inactividad
    executeFunctionOnInactivity();
  }, inactivityDelay);
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  startInactivityTimer();
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

startInactivityTimer();

function executeFunctionOnInactivity() {
  // Aquí va la función que deseas ejecutar cuando se detecta inactividad
  console.log('Ejecutando función de inactividad...');
  // Por ejemplo, puedes redirigir al usuario a una página de inicio de sesión
  window.location.href = '/login';
}
// ---------------------------------------------------------------------------------------------------------

let seconds = 0;
let intervalId = null;

function startTimer() {
  intervalId = setInterval(() => {
    seconds++;
    updateTimerDisplay();
    if (seconds >= 60) {
      // Ejecuta la función después de 1 minuto
      executeFunctionAfter1Minute();
      clearInterval(intervalId);
    }
  }, 1000); // 1000ms = 1 segundo
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  timerDisplay.innerText = `Tiempo: ${seconds} segundos`;
}

function executeFunctionAfter1Minute() {
  console.log('Se ha ejecutado la función después de 1 minuto!');
  // Aquí puedes ejecutar la función que deseas después de 1 minuto
}

// Inicializa el cronómetro
startTimer();


// ---------------------------------------------------------------------------------------------
// Primero, seleccionamos el formulario y el botón que está fuera del formulario
const formulario = document.getElementById('miFormulario');
const boton = document.getElementById('miBoton');

// Luego, agregamos un evento de click al botón que activará el evento de submit del formulario
boton.addEventListener('click', () => {
  formulario.submit();
});

// -------------------------------------------------------------------------------------------


// 1. Utilizar un gancho personalizado

// Puedes crear un gancho personalizado que se encargue de manejar la inactividad. Por ejemplo, puedes crear un archivo useInactivity.jscon el siguiente contenido:

javascript

Verificar

// Abrir en el editor
// Editar
// Correr
// Copiar código
import { useState, useEffect } from 'eact';

const useInactivity = (delay = 10 * 60 * 1000) => {
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setInactivityTimeout(null);
    };

    const handleKeyDown = () => {
      setInactivityTimeout(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!inactivityTimeout) {
      setInactivityTimeout(setTimeout(() => {
        console.log('Inactividad detectada!');
        // Ejecuta la función que deseas cuando se detecta inactividad
        executeFunctionOnInactivity();
      }, delay));
    }
  }, [inactivityTimeout, delay]);

  return () => {
    clearTimeout(inactivityTimeout);
  };
};

export default useInactivity;
// Luego, en tu componente, puedes importar y utilizar este gancho de la siguiente manera:

// javascript


import React from 'eact';
import useInactivity from './useInactivity';

const MyComponent = () => {
  useInactivity();

  return <div>Contenido de mi componente</div>;
};
// 2. Utilizar un componente de orden superior (HOC)

// Puedes crear un componente de orden superior (HOC) que se encargue de manejar la inactividad. Por ejemplo, puedes crear un archivo withInactivity.jscon el siguiente contenido:

// javascript

// Verificar

import React, { useState, useEffect } from 'eact';

const withInactivity = (WrappedComponent) => {
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setInactivityTimeout(null);
    };

    const handleKeyDown = () => {
      setInactivityTimeout(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!inactivityTimeout) {
      setInactivityTimeout(setTimeout(() => {
        console.log('Inactividad detectada!');
        // Ejecuta la función que deseas cuando se detecta inactividad
        executeFunctionOnInactivity();
      }, 10 * 60 * 1000));
    }
  }, [inactivityTimeout]);

  return <WrappedComponent />;
};

// export default withInactivity;
// Luego, en tu componente, puedes utilizar este HOC de la siguiente manera:

// javascript

// Verificar

// Abrir en el editor
// Editar
// Correr
// Copiar código
import React from 'eact';
import withInactivity from './withInactivity';

const MyComponent = () => {
  return <div>Contenido de mi componente</div>;
};

export default withInactivity(MyComponent);
// 3. Utilizar un contexto

// Puedes crear un contexto que se encargue de manejar la inactividad. Por ejemplo, puedes crear un archivo inactivityContext.jscon el siguiente contenido:

// javascript

import { createContext, useState, useEffect } from 'eact';

const InactivityContext = createContext();

const InactivityProvider = ({ children }) => {
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setInactivityTimeout(null);
    };

    const handleKeyDown = () => {
      setInactivityTimeout(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!inactivityTimeout) {
      setInactivityTimeout(setTimeout(() => {
        console.log('Inactividad detectada!');
        // Ejecuta la función que deseas cuando se detecta inactividad
        executeFunctionOnInactivity();
      }, 10 * 60 * 1000));
    }
  }, [inactivityTimeout]);

  return (
    <InactivityContext.Provider value={{ inactivityTimeout }}>
      {children}
    </InactivityContext.Provider>
  );
};

export { InactivityProvider,