import { useEffect, useState, useRef } from "react";
import { estadisticas } from "../../utils/API.jsx";
import { alertConfim, toastError, alertMotivo } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { searchCode, getListItems, deleteItem } from "../../utils/actions.jsx";
import Chart from 'chart.js/auto';
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { RadioStart } from "../../components/input/Inputs";
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import Pildora from "../../components/Pildora.jsx";
import texts from "../../context/text_es.js";
import dayjsEs from "../../utils/dayjs.js";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import { toFormData } from "axios";

function Estadistica() {
    const [errorServer, setErrorServer] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const renderizado = useRef(0);
    const [chartTorta, setChartTorta] = useState(null);
    const [grafPreguntas, setGrafPreguntas] = useState([]);
    const [grafRecreadores, setGrafRecreadores] = useState([]);
    const [grafServicios, setGrafServicios] = useState(null);

    useEffect(() => {
        document.title = "Estadisticas - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1;
            graficoTorta()
            graficoPreguntas()
            graficoServicios()
            graficoRecreadores()
            graficoEvento()
            return;
        }


    }, []);

    const graficoTorta = async () => {
        try {
            const torta = await estadisticas.get({ params: { eventos_estado: true } })
            if (torta.data.status) {
                const ctx = document.getElementById('myChartTorta');


                const chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['En espera', 'Cancelado', 'Completado'],
                        datasets: [{
                            data: torta.data.data.estado.map(e => e.count),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 206, 86, 0.5)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                });
                setChartTorta(chart);
            } else {

                setErrorServer("Error en el grafico de Torta no hay data")
            }

        } catch (error) {
            console.log(error)
            setErrorServer("Error en el grafico de Torta")
        }


    }

    function getCountArray(array) {
        const result = [];
        for (let i = 1; i <= 12; i++) {
          const obj = array.find(item => item.id === i);
          result.push(obj ? obj.count : 0);
        }
        return result;
      }

    const graficoEvento = async () => {
        try {
            const evento = await estadisticas.get({ params: { eventos: true } })
            if (evento.data.status) {
                const ctx = document.getElementById('myCharEventos');


                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembte"],
                        datasets: [{
                            label: 'Eventos Completados 2024',
                            data: getCountArray(evento.data.data.evento),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    }
                });
                setChartTorta(chart);
            } else {

                setErrorServer("Error en el grafico de Torta no hay data")
            }

        } catch (error) {
            console.log(error)
            setErrorServer("Error en el grafico de Torta")
        }
    }

    const graficoPreguntas = async () => {
        try {
            const preguntas = await estadisticas.get({ params: { preguntas: true } })
            if (preguntas.data.status) {
                setGrafPreguntas(preguntas.data.data.preguntas)
            } else {
                setErrorServer("Error en las preguntas no hay data")
            }

        } catch {
            setErrorServer("Error en las preguntas")
        }
    }



    const graficoRecreadores = async () => {
        try {
            const recreadores = await estadisticas.get({ params: { recreadores: true } })
            if (recreadores.data.status) {
                setGrafRecreadores(recreadores.data.data.recreadores)
            } else {
                setErrorServer("Error en las preguntas no hay data")
            }

        } catch {
            setErrorServer("Error en las preguntas")
        }
    }

    const graficoServicios = async () => {
        try {
            const servicios = await estadisticas.get({ params: { servicios: true } })
            if (servicios.data.status) {
                const ctx = document.getElementById('myChartServicios');


                const chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: servicios.data.data.servicios.map(e => e.nombre),
                        datasets: [{
                            label: 'Contratados',
                            data: servicios.data.data.servicios.map(e => e.contador),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 10,
                                    min: 0
                                }
                            }
                        }
                    }
                });
                setGrafServicios(chart);
            } else {
                setErrorServer("Error en las servicios no hay data")
            }

        } catch {
            setErrorServer("Error en las servicios")
        }
    }

    return (
        <Navbar
            name={"Estadisticas"}
            descripcion={"Diferentes estadisticas del sistema"}
        >
            {
                errorServer ?
                    (
                        <div className="div-main justify-content-center p-4">
                            <ErrorSystem error={errorServer} />
                        </div>
                    )
                    :
                    (
                        <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
                            <div className="w-100 w-md-60 d-flex flex-column px-3 py-2 my-4 border boder-info border-2">
                                <h2 className="fw-bold text-center">Estado de los diferentes Eventos</h2>
                                <canvas id="myChartTorta" width="200px" height="200px"></canvas>
                            </div>
                            <div className="w-100 w-md-60 d-flex flex-column px-3 py-2 my-4 border boder-info border-2">
                                <h2 className="fw-bold text-center">Servicios mas contratados</h2>
                                <canvas id="myChartServicios" width="500px" height="200px"></canvas>
                            </div>

                            <div className="w-100 w-md-60 d-flex flex-column px-3 py-2 my-4 border boder-info border-2">
                                <h2 className="fw-bold text-center">Eventos Completados</h2>
                                <canvas id="myCharEventos" width="500px" height="200px"></canvas>
                            </div>
                            {
                                grafPreguntas.length > 0 &&
                                <div className="w-100 d-flex flex-column px-3 py-2 my-4 border boder-info border-2">
                                    <h2 className="fw-bold text-center">Evaluacion Promedio de los eventos</h2>
                                    <div className="w-10 px-5">
                                        {
                                            grafPreguntas.map((e, index) => (
                                                <div className="d-flex gap-2">
                                                    <div className="w-50"><strong className="m-0 fw-bold fs-">{e.pregunta}</strong></div>
                                                    <div className=""><RadioStart save={() => { }} state={[]} index={index} id={`evaluacion-pregunta-${index}`} name={`evaluacion-pregunta-${index}`} check={Number(e.promedio_evaluacion).toFixed(0)} block={true} /></div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>
                            }

                            {
                                grafRecreadores.length > 0 &&
                                <div className="w-100 d-flex flex-column px-3 py-2 my-4 border boder-info border-2">
                                    <h2 className="fw-bold text-center">Evaluacion Promedio de los eventos</h2>
                                    <div className="w-10 px-5">
                                        {
                                            grafRecreadores.map((e, index) => (
                                                <div className="d-flex gap-2">
                                                    <div className="w-50"><strong className="m-0 fw-bold fs-">{e.nombres} {e.apellidos}</strong></div>
                                                    <div className=""><RadioStart save={() => { }} state={[]} index={index} id={`evaluacion-recreador-${index}`} name={`evaluacion-recreador-${index}`} check={Number(e.evaluacion).toFixed(0)} block={true} /></div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>
                            }

                        </div>
                    )
            }

            <Toaster />
        </Navbar>
    )

}
export default Estadistica