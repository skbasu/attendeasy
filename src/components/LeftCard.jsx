import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import instance from '../api';
import { getInitialsAndTitle, convertToDate, calculateTimeAgo } from '../utils.js';

Chart.register(ArcElement, Tooltip, Legend);

const LeftCard = () => {

    const studentId = localStorage.getItem("studentId");

    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [latestclasses, setlatestClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        const getTotalAttendance = async () => {
            await instance.get(`/view/${studentId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                }
            })
            .then((response) => {
                setAttendanceDetails(response.data);
                setLoading(false);
            })
        }

        const getLatest = async () => {
            await instance.get(`/latest/${studentId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                }
            })
            .then((response) => {
                setlatestClasses(response.data);
            })
        }

        const fetchLastModified = async () => {
            const response = await instance.get('/updatetime/records/row/getLastModified', {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                }
            });
            const modifiedTime = new Date(response.data.last_modified);
            const timeDifference = calculateTimeAgo(modifiedTime);
            setTimeAgo(timeDifference);
        };

        getTotalAttendance();
        getLatest();
        fetchLastModified();
    }, [attendanceDetails, latestclasses])

    if (loading) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }

    if (!attendanceDetails) {
        return <div>No attendance data available.</div>;
    }

    const totalhrs =  attendanceDetails?.alltotal_class_hours || 0;
    const presenthrs = attendanceDetails?.allattended_class_hours || 0;
    const missedhrs = totalhrs - presenthrs;
    const attendancePercentage = totalhrs > 0 ? (presenthrs / totalhrs) * 100 : 0;
    const finalText = `${attendancePercentage.toFixed(1) == 100.0 ? '100' : attendancePercentage.toFixed(1)}%`;

    const data = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [presenthrs || 0, missedhrs || 0], 
                backgroundColor: ['#00D25B', '#16302A'],
                borderColor: ['#00D25B', '#16302A'],
                hoverBackgroundColor: ['#00D25B', '#16302A'],
                hoverBorderColor: ['#00D25B', '#16302A'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        rotation: Math.PI,
        animation: {
            animateRotate: true,  
            duration: 1000, 
            animateScale: true,
        },
        cutout: '80%',
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data } = chart;
            const x = chart.getDatasetMeta(0).data[0].x;
            const y = chart.getDatasetMeta(0).data[0].y;

            const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(1, '#3b82f6');

            ctx.save();
            ctx.font = 'bold 35px sans-serif';
            ctx.fillStyle = gradient;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(finalText, x, y);
            ctx.restore();
        }
    };

    return (
        <div className='bg-[#191C24] p-5 w-full md:w-[35%] lg:w-[25%] flex-shrink-0'>
            <div className='flex flex-row justify-between items-center'>
                <h2 className='text-xl font-bold text-white font-sans'>Total Percentage</h2>
                <h3 className='text-xs text-slate-600 lg:text-sm'>{timeAgo}</h3>
            </div>
            <div className='flex justify-center items-center w-full mt-3'>
                <div className='w-56'>
                    <Doughnut options={options} data={data} plugins={[textCenter]} />
                </div>
            </div>

            <div className='mt-2 flex flex-row justify-between items-center p-3 bg-[#12151E]'>
                <div>
                    <h1 className='text-xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent font-bold'>Classes Attended</h1>
                    <p className='font-bold text-slate-600'>In Hours</p>
                </div>
                <div className={`p-1 ${attendancePercentage >= 75 ? 'bg-[#16302A]' : 'bg-[#322028]'}`}>
                    <h3 className='text-xl font-bold' style={{ color: `${attendancePercentage >= 75 ? '#00D25B' : '#FC4245'}` }}>{presenthrs}/{totalhrs}</h3>
                </div>
            </div>

            <h2 className='mt-2 text-xl font-bold text-white font-sans'>Last 5 Classes</h2>
            {
                latestclasses.map((latest) => (
                    <div className={`mt-2 p-1 flex flex-row justify-between ${latest.status === "present" ? 'bg-[#16302A]' : 'bg-[#322028]'}`}>
                        <h1 className='text-sm' style={{ color: `${latest.status === "present" ? '#00D25B' : '#FC4245'}` }}>{latest.paper_code}</h1>
                        <h1 className='text-sm' style={{ color: `${latest.status === "present" ? '#00D25B' : '#FC4245'}` }}>{convertToDate(latest.class_date)}</h1>
                        <h2 className='text-sm' style={{ color: `${latest.status === "present" ? '#00D25B' : '#FC4245'}` }}>{getInitialsAndTitle(latest.teacher_name, latest.teacher_gender)}</h2>
                    </div>
                ))
            }
        </div>
    );
};

export default LeftCard;
