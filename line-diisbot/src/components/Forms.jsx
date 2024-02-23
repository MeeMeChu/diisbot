import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import database from './FirebaseConfig'

const defaultTheme = createTheme();
    
export default function Forms() {   
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [urgency, setUrgency] = useState('');
    const [session, setSession] = useState('');
    const [ticket, setTicket] = useState('');
    const [userLineID, setUserLineID] = useState('');

    //REST API GET
    const username = 'glpi'
    const password = 'glpi' 

    const liff = window.liff;

    const postTicket = async (event) => {
        event.preventDefault();
        const urls = 'https://glpi.streamsouth.tech/apirest.php/Ticket'
        const data = {
            "input": {
                "name": title,
                "itilcategories_id": category,
                "content": description,
                "status": '1',
                "urgency": urgency,
                "_disablenotif": true
            }
        }

        try {
            const res = await axios.post(urls, data, {
                headers: {
                    'App-Token': 'EHlx1ZbY2T1nChtbiNXbdfekzAjvsCtUjEjn8POY',
                    'Content-Type': 'application/json',
                    'Session-token': session
                }
            });

            setTicket(res.data.id);
            
            await database.ref("User/" + userLineID).push({
                ticket_id: res.data.id
            });

            setTicket(res.data.id);

            Swal.fire({
                title: "ทำรายการสำเร็จ",
                text: "ส่งข้อมูลเรียบร้อยแล้ว!",
                icon: "success"
            });
        } catch (error) {
            alert(error);
            Swal.fire({
                icon: "error",
                title: "ไม่สามารถทำรายการได้!",
                text: "มีบางอย่างผิดพลาด!",
            });
        }
    };

    // const postTicket = (event) => {
    //     event.preventDefault();
    //     const urls = 'https://glpi.streamsouth.tech/apirest.php/Ticket'
    //     const data = {
    //         "input" : {
    //             "name": title,
    //             "itilcategories_id": category,
    //             "content": description,
    //             "status" : '1',
    //             "urgency": urgency,
    //             "_disablenotif" : true
    //         }
    //     }
    //     axios.post(urls, data, {
    //         headers: {
    //             'App-Token' : 'EHlx1ZbY2T1nChtbiNXbdfekzAjvsCtUjEjn8POY',
    //             'Content-Type': 'application/json',
    //             'Session-token' : session
    //         }
    //     }).then((res) => {
    //         setTicket(res.data.id);

    //         database.ref("User/" + userLineID).push({
    //             ticket_id: ticket
    //         }).catch(alert);

    //         Swal.fire({
    //             title: "ทำรายการสำเร็จ",
    //             text: "ส่งข้อมูลเรียบร้อยแล้ว!",
    //             icon: "success"
    //         });
    //     })
    // };

    useEffect( () => {
        axios.get('https://glpi.streamsouth.tech/apirest.php/initSession', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Basic " + btoa(username + ':' + password),
                'App-Token': 'EHlx1ZbY2T1nChtbiNXbdfekzAjvsCtUjEjn8POY',
             }
         }).then((response) => {
            setSession(response.data.session_token)
         }) 
        const initializeLiff = async () => {
            try {
                await liff.init({ liffId: '2003711805-VkQ1lj9R' });
                if (liff.isLoggedIn()) {
                    let getProfile = await liff.getProfile();
                    setUserLineID(getProfile.userId);
                } else {
                    liff.login();
                }
            } catch (error) {
                console.error('Error initializing LIFF:', error);
            }
        };

        initializeLiff();
    }, []);
 
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {ticket} กรอกคำร้อง {session} 
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="ชื่อคำร้อง"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="categories">หมวดหมู่  </InputLabel>
                            <Select
                                labelId="categories"
                                id="categories"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label="Categories"
                                required
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>SiS</MenuItem>
                                <MenuItem value={2}>NetWork</MenuItem>
                                <MenuItem value={3}>อื่นๆ</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="desciption"
                            label="รายละเอียด"
                            multiline
                            required
                            fullWidth
                            value={description}
                            margin="normal"
                            rows={10}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="">ระดับความเร่งด่วน</InputLabel>
                            <Select
                                labelId="urgency"
                                id="urgency"
                                value={urgency}
                                required
                                onChange={(e) => setUrgency(e.target.value)}
                                label="ระดับความเร่งด่วน"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={postTicket}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}