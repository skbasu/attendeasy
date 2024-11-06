import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getInitialsAndTitle, convertToDate } from '../utils';
import instance from '../api';

Chart.register(ArcElement, Tooltip, Legend);

const PaperCards = ({ paperId, paperName, paperCode, teacherName, teacherGender, total, present }) => {

    const [open, setOpen] = useState(false);
    const studentId = localStorage.getItem("studentId");
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth-token");

        const getDatewise = async () => {
            await instance.get(`/${studentId}/${paperCode}/${teacherName}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                }
            })
            .then((response) => {
                setDates(response.data)
                setLoading(false);
            })
        }
        
        getDatewise();
    },[])

    if(loading){
        return <div style={{ color: "white" }}>Loading...</div>
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const totalhrs = total || 0;
    const presenthrs = present || 0;
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
        cutout: '80%',
        animation: {
            animateRotate: true, 
            duration: 1000, 
            animateScale: true,
        },
        plugins: {
            legend: {
                display: false,
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
            ctx.font = 'bolder 22px sans-serif';
            ctx.fillStyle = gradient;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(finalText, x, y);
            ctx.restore();
        }
    };

    return (
        <div className='p-2 bg-[#191C24] md:h-64'>
            <div className='flex flex-row justify-between items-center p-2'>
                <h2 className='font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent md:text-base'>{paperCode}</h2>
                <h2 className='font-bold md:text-base'>{getInitialsAndTitle(teacherName, teacherGender)}</h2>
            </div>
            <div className='flex justify-center items-center w-full mt-3'>
                <div className='w-28 h-28 md:w-32 md:h-32'>
                    <Doughnut options={options} data={data} plugins={[textCenter]} />
                </div>
            </div>
            <div className='px-2 flex flex-row justify-between items-center'>
                <h1 className={`text-base mt-4 p-1 ${attendancePercentage >= 75 ? 'bg-[#16302A]' : 'bg-[#322028]'} w-fit`} style={{ color: `${attendancePercentage >= 75 ? '#00D25B' : '#FC4245'}` }}>{presenthrs}/{totalhrs}</h1>
                <div className='mt-4 bg-[#2A4C62] p-1 w-fit cursor-pointer' onClick={handleClickOpen}>
                    <ArrowForwardIosIcon style={{ color: "#27A4FB" }} />
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <IconButton
                    onClick={handleClose}
                    sx={() => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    })}
                >
                    <CloseIcon style={{ color: "#27A4FB" }} />
                </IconButton>
                <DialogContent style={{ backgroundColor: "#191C24" }}>
                    <h2 className='text-sm font-bold text-slate-600'>{paperCode}</h2>
                    <h2 className='font-bold text-xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'>{paperName}</h2>
                    <h2 className='text-sm text-white'>{getInitialsAndTitle(teacherName, teacherGender)}</h2>
                    <div className='mt-3 flex flex-row grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {
                            dates.map((datestatus) => (
                                <div className={`p-1 ${datestatus.status === "present" ? 'bg-[#16302A]' : 'bg-[#322028]'} w-fit`}>
                                    <h2 className='lg:text-lg' style={{ color: `${datestatus.status === "present" ? '#00D25B' : '#FC4245'}` }}>{convertToDate(datestatus.class_date)}</h2>
                                </div>
                            ))
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PaperCards;
