import React, { useEffect, useState } from 'react';
import LeftCard from '../components/LeftCard';
import PaperCards from '../components/PaperCards';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import instance from '../api';
import { getFirstName } from '../utils.js';

const HomeScreen = () => {

    const navigateTo = useNavigate();

    const [open, setOpen] = useState(false);
    const [studentinfo, setStudentInfo] = useState([]);
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    const studentId = localStorage.getItem("studentId");

    const handleSignOut = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("studentId");
        navigateTo('/signin');
    }

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("auth-token");
        }

        const getStudentInfo = async () => {
            await instance.get(`/${studentId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                }
            })
            .then((res) => {
                setStudentInfo(res.data[0])
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    handleSignOut();
                }
            })
        }

        const getPaperwise = async () => {
            await instance.get(`/view/${studentId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                }
            })
            .then((response) => {
                setPapers(response.data.paperwise);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    handleSignOut();
                }
            })
        }

        getPaperwise();
        getStudentInfo();
    }, [studentId, navigateTo])

    if (loading) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }

    if(!papers){
        return <div style={{ color: "white" }}>No paper wise data available...</div>;
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className='p-5 min-h-screen'>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row'>
                    <h2 className='text-2xl sm:text-4xl font-bold text-white font-sans'>Hi</h2>
                    <h1 className='ml-2 text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'>{getFirstName(studentinfo.student_name)},</h1>
                </div>
                <AccountCircleOutlinedIcon className='cursor-pointer' onClick={handleClickOpen} style={{ color: "gray" }} fontSize="large" />
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
                <DialogTitle style={{ backgroundColor: "#191C24" }}>
                    <h2 className='text-white'>My Profile</h2>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: "#191C24" }}>
                    <h2 className='font-bold text-xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'>{studentinfo.student_name}</h2>
                    <h2 className='text-base font-bold text-slate-600'>{studentinfo.student_email}</h2>
                    <div className='flex flex-row justify-between items-center'>
                        <h2 className='text-sm font-bold text-slate-400'>Roll - {studentinfo.student_id}</h2>
                        <h2 className='text-sm font-bold text-slate-400'>Sem - {studentinfo.student_semester}</h2>
                   </div>
                    <button onClick={handleSignOut} className='w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 transition-colors'>Sign Out</button>
                </DialogContent>
            </Dialog>

            <div className='flex flex-col md:flex-row justify-between mt-5'>
                <LeftCard />
                <div
                    style={{ scrollbarWidth: 'none' }}
                    className='w-full md:w-[75%] md:ml-7 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 md:mt-0 grids lg:h-[85vh] lg:overflow-y-scroll'
                >
                    {
                        papers.map((paperwise) => (
                            <PaperCards 
                                key={paperwise.paper_id}
                                paperId={paperwise.paper_id}
                                paperCode={paperwise.paper_code}
                                paperName={paperwise.paper_name}
                                teacherName={paperwise.teacher_name}
                                teacherGender={paperwise.teacher_gender}
                                total={paperwise.total_class_hours}
                                present={paperwise.attended_class_hours}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
