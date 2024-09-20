import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Sidenav from './Sidenav';
import { Button } from 'react-bootstrap';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Header from './Header';

const TableStatistics = () => {
    const [chartState, setChartState] = useState({
        series: [{
            name: 'Estadisticas',
            data: [20, 40, 28, 31, 22]
        }],
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false,
                    tools: {
                        download: false,
                        resetZoom: false,
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'category',
                categories: ["S 1", "S 2", "S 3", "S 4", "S 5"],
                labels: {
                    style: {
                        colors: '#d0d5db',
                        fontSize: '16px',
                    },
                    offsetY: 10
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            grid: {
                borderColor: '#dee2e62a',
                opacity: 0.1,
                yaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            yaxis: {
                show: false,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                    stops: ['0,0,0']
                }
            },
            colors: ['#008FFB']
        },
    });

    const [analysis, setAnalysis] = useState('');
    const [isProgressing, setIsProgressing] = useState(null);

    useEffect(() => {
        generateAnalysis(chartState.series[0].data);
    }, [chartState.series]);

    const generateAnalysis = (data) => {
        const initial = data[0];
        const final = data[data.length - 1];
        const percentageChange = ((final - initial) / initial) * 100;

        setIsProgressing(percentageChange >= 0);
        const analysisText = ` ${Math.abs(percentageChange).toFixed(2)}% `;

        setAnalysis(analysisText);
    };
    return (
        <>
            <Header />
            <div className="d-flex">
                <Sidenav />
                <div className=" flex-grow-1 sidebar">
                    <div className="m_bgblack text-white m_borbot j-tbl-font-1">
                        <div className="j-table-datos-btn">
                            <Button variant="outline-primary" className='j-tbl-btn-font-1 '>
                                <HiOutlineArrowLeft className='j-table-datos-icon' />Regresar</Button>
                        </div>
                        <div className='j-table-information-head-buttons'>
                            <h5 className="j-table-information-1 j-table-text-23 ">Datos mesa 1</h5>

                            <div className="j-table-information-btn-1">
                                <Button data-bs-theme="dark"
                                    className="j-canvas-btn2 j-tbl-font-3"
                                    variant="primary"
                                >
                                    <div className="d-flex align-items-center">
                                        <svg className="j-canvas-btn-i" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd" />
                                        </svg>
                                        Generar reporte
                                    </div>
                                </Button>
                                <Button
                                    data-bs-theme="dark"
                                    className="j-canvas-btn2 j-tbl-font-3"
                                    variant="outline-primary"
                                >
                                    <div className="d-flex align-items-center">
                                        <svg className="j-canvas-btn-i" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd" />
                                            <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd" />
                                        </svg>
                                        Editar
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="j-table-information-data">
                        <div className="j-table-border-bottom">
                            <Link to={"/table/information"}>
                                <h4 className='mb-0 j-table-information-data-text-234 j-table-information-text-light'>Información</h4>
                            </Link>
                            <Link to={"/table/historial"}>
                                <h4 className='mb-0 j-table-information-data-text-234 j-table-information-text-light '>Historial</h4>
                            </Link>
                            <Link to={"/table/statistics"}>
                                <h4 className='mb-0 j-table-information-data-text-234 '>Estadísticas</h4>
                            </Link>
                        </div>

                    </div>
                    <div className="j-table-statistics-body ">
                        <div className="row">
                            <div className="col-6">
                                <div className="j-statistics-form">
                                    <div className="d-flex gap-3 ">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="exampleFormControlInput1"
                                                className="form-label text-white j-tbl-font-11"
                                            >
                                                Desde
                                            </label>
                                            <select
                                                className="form-select j-input-width2 j-tbl-information-input  b_select border-0 py-2  " style={{ borderRadius: "6px" }}
                                                aria-label="Default select example"
                                            >
                                                <option selected>Enero</option>
                                                <option value="1">February</option>
                                                <option value="2">March</option>
                                                <option value="3">April</option>
                                                <option value="4">May</option>
                                                <option value="5">June</option>
                                                <option value="6">July</option>
                                                <option value="7">Sepetember</option>
                                                <option value="8">Octomber</option>
                                                <option value="9">November</option>
                                                <option value="10">Desember</option>
                                            </select>

                                        </div>
                                        <div className="mb-3 ">
                                            <label
                                                htmlFor="exampleFormControlInput1"
                                                className="form-label text-white j-tbl-font-11"
                                            >
                                                Hasta
                                            </label>
                                            <select
                                                className="form-select j-input-width2 j-tbl-information-input  b_select border-0 py-2  " style={{ borderRadius: "6px" }}
                                                aria-label="Default select example"
                                            >
                                                <option selected>Enero</option>
                                                <option value="1">February</option>
                                                <option value="2">March</option>
                                                <option value="3">April</option>
                                                <option value="4">May</option>
                                                <option value="5">June</option>
                                                <option value="6">July</option>
                                                <option value="7">Sepetember</option>
                                                <option value="8">Octomber</option>
                                                <option value="9">November</option>
                                                <option value="10">Desember</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="j-statistics-form">
                                    <div style={{ position: 'relative' }} className='py-3 j-table-chart'>
                                        <div id="chart" className='m_chart'>
                                            <ReactApexChart options={chartState.options} series={chartState.series} type="area" height={350} />
                                        </div>
                                        <div
                                            id="analysis"
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '20px',
                                                fontSize: '16px',
                                                color: isProgressing ? 'green' : 'red',
                                                fontWeight: 700
                                            }}
                                        >
                                            {analysis}  {isProgressing ? <FaArrowUp /> : <FaArrowDown />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>



    )

}

export default TableStatistics
