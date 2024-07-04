import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Metrics = () => {
    const [evaluationResults, setEvaluationResults] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:8001/metrics')
            .then(response => {
                if (!response.data || response.status !== 200) {
                    throw new Error('Error al obtener métricas');
                }
                setEvaluationResults(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    useEffect(() => {
        if (!chartRef.current || !evaluationResults) return;

        const ctx = chartRef.current.getContext('2d');

        // Verificar que los datos estén definidos
        const trainReport = evaluationResults.train_classification_report;
        const testReport = evaluationResults.test_classification_report;
        if (!trainReport['0'] || !trainReport['1'] || !trainReport['2'] || !trainReport['3'] || !trainReport['4'] ||
            !testReport['0'] || !testReport['1'] || !testReport['2'] || !testReport['3'] || !testReport['4']) {
            console.error('Datos de clasificación incompletos:', trainReport, testReport);
            return;
        }

        // Destruir el gráfico anterior si existe
        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        // Crear el nuevo gráfico
        chartRef.current.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['No Cyberbullying', 'Gender-based', 'Religion-based', 'Age-based', 'Ethnicity-based'],
                datasets: [
                    {
                        label: 'Train Precision',
                        data: [
                            trainReport['0'].precision * 100,
                            trainReport['1'].precision * 100,
                            trainReport['2'].precision * 100,
                            trainReport['3'].precision * 100,
                            trainReport['4'].precision * 100
                        ],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        barThickness: 15
                    },
                    {
                        label: 'Train Recall',
                        data: [
                            trainReport['0'].recall * 100,
                            trainReport['1'].recall * 100,
                            trainReport['2'].recall * 100,
                            trainReport['3'].recall * 100,
                            trainReport['4'].recall * 100
                        ],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        barThickness: 15
                    },
                    {
                        label: 'Train F1-score',
                        data: [
                            trainReport['0']['f1-score'] * 100,
                            trainReport['1']['f1-score'] * 100,
                            trainReport['2']['f1-score'] * 100,
                            trainReport['3']['f1-score'] * 100,
                            trainReport['4']['f1-score'] * 100
                        ],
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 2,
                        barThickness: 15
                    },
                    {
                        label: 'Test Precision',
                        data: [
                            testReport['0'].precision * 100,
                            testReport['1'].precision * 100,
                            testReport['2'].precision * 100,
                            testReport['3'].precision * 100,
                            testReport['4'].precision * 100
                        ],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        barThickness: 15
                    },
                    {
                        label: 'Test Recall',
                        data: [
                            testReport['0'].recall * 100,
                            testReport['1'].recall * 100,
                            testReport['2'].recall * 100,
                            testReport['3'].recall * 100,
                            testReport['4'].recall * 100
                        ],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 2,
                        barThickness: 15
                    },
                    {
                        label: 'Test F1-score',
                        data: [
                            testReport['0']['f1-score'] * 100,
                            testReport['1']['f1-score'] * 100,
                            testReport['2']['f1-score'] * 100,
                            testReport['3']['f1-score'] * 100,
                            testReport['4']['f1-score'] * 100
                        ],
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 2,
                        barThickness: 15
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: 'white',
                            font: {
                                family: 'Poppins',
                                weight: 'bold',
                                size: 16,
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white',
                            font: { 
                                family: 'Poppins',
                                weight: 'bold',
                                size: 16,
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white',
                            font: {
                                family: 'Poppins',
                                weight: 'bold',
                                size: 16,
                            }
                        }
                    }
                }
            }
        });
    }, [evaluationResults]);

    return (
        <div style={{ height: '450px', margin: '0 auto', color: 'white' }}>
            <h1 className='title'>Métricas de Evaluación</h1>
            {evaluationResults && (
                <h3>
                   Train Accuracy: {(evaluationResults.train_accuracy * 100).toFixed(2)}%  <br/>
                   Test Accuracy: {(evaluationResults.test_accuracy * 100).toFixed(2)}%
                </h3>
            )}
            <canvas ref={chartRef} />
        </div>
    );
};

export default Metrics;
