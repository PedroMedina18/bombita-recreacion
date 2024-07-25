import { useState, useEffect } from 'react'

const useInactivity = (inactivityDelay = 9000) => {
    const [inactivityTimeout, setInactivityTimeout] = useState();
    
    useEffect(() => {
        const handleActivity = (e) => {
            clearTimeout(inactivityTimeout);
            startInactivityTimer()
        };


        // document.addEventListener('mousemove', handleActivity);
        document.addEventListener('keydown', handleActivity);
        document.addEventListener('click', handleActivity);

        startInactivityTimer()
        return () => {
            document.removeEventListener('click', handleActivity);
            document.removeEventListener('keydown', handleActivity);
          };
    }, []);

    function startInactivityTimer() {
        setInactivityTimeout(setTimeout(() => {
          console.log('Inactividad detectada!');
        }, inactivityDelay));
    }

    return () => {
        clearTimeout(inactivityTimeout);
    };
};

export default useInactivity