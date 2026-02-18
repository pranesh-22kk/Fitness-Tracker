import { useState, useContext } from 'react';
import { AuthContext } from "../../utils/authentication/auth-context";
import Navbar from "../../components/navbar/navbar";
import axios from "axios";
import "./bmrInfo.scss";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from '@mui/material/Button';

const BmrInfo = () => {
    const { user } = useContext(AuthContext);
    const userId = user._id;

    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [bmr, setBmr] = useState(null);
    const [tdee, setTdee] = useState(null);

    const activityMultipliers = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'Very Active': 1.725,
        'Extra Active': 1.9
    };

    const calculateBMR = () => {
        let bmrResult;
        if (gender === 'Male') {
            bmrResult = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmrResult = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        
        setBmr(Math.round(bmrResult));
        const tdeeResult = bmrResult * activityMultipliers[activityLevel];
        setTdee(Math.round(tdeeResult));

        saveBmrCalculation(bmrResult, tdeeResult);
    };

    const saveBmrCalculation = async (bmrValue, tdeeValue) => {
        try {
            await axios.post('/bmr/save', {
                userId,
                age,
                weight,
                height,
                gender,
                activityLevel,
                bmr: bmrValue,
                tdee: tdeeValue,
                date: new Date()
            }, {
                headers: { token: `Bearer ${user.accessToken}` }
            });
        } catch (error) {
            console.error('Error saving BMR calculation:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateBMR();
    };

    return (
        <div className="bmrInfo">
            <Navbar />
            <div className="content-wrapper">
                <div className="left-column">
                    <h4 className="sectionTitle">BMR & TDEE Calculator</h4>
                    <div className="inputContainer">
                        <Box sx={{ minWidth: 230 }}>
                            <div className="input-group">
                                <label htmlFor="age">Age</label>
                                <input
                                    id="age"
                                    type="number"
                                    value={age}
                                    className="inputBox"
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="weight">Weight (kg)</label>
                                <input
                                    id="weight"
                                    type="number"
                                    value={weight}
                                    className="inputBox"
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="height">Height (cm)</label>
                                <input
                                    id="height"
                                    type="number"
                                    value={height}
                                    className="inputBox"
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                        </Box>
                    </div>

                    <div className="selectContainer">
                        <Box sx={{ width: 240 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#ebc034' }}>Gender</InputLabel>
                                <Select
                                    value={gender}
                                    label="Gender"
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#ebc034' }}>Activity Level</InputLabel>
                                <Select
                                    value={activityLevel}
                                    label="Activity Level"
                                    onChange={(e) => setActivityLevel(e.target.value)}
                                >
                                    <MenuItem value="Sedentary">Sedentary (little or no exercise)</MenuItem>
                                    <MenuItem value="Light">Light (exercise 1-3 times/week)</MenuItem>
                                    <MenuItem value="Moderate">Moderate (exercise 3-5 times/week)</MenuItem>
                                    <MenuItem value="Very Active">Very Active (exercise 6-7 times/week)</MenuItem>
                                    <MenuItem value="Extra Active">Extra Active (very intense exercise daily)</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                className="calculate-button"
                                onClick={handleSubmit}
                                sx={{
                                    width: '100%',
                                    background: 'linear-gradient(45deg, #ebc034, #ff9d00)',
                                    color: '#000000',
                                    fontWeight: 'bold'
                                }}
                            >
                                Calculate
                            </Button>
                        </Box>
                    </div>
                </div>

                {bmr && tdee && (
                    <div className="right-column">
                        <div className="results">
                            <div className="resultBox">
                                <h3>Your BMR:</h3>
                                <p>{bmr} calories/day</p>
                                <span className="info">This is your Basal Metabolic Rate (calories burned at rest)</span>
                            </div>
                            <div className="resultBox">
                                <h3>Your TDEE:</h3>
                                <p>{tdee} calories/day</p>
                                <span className="info">This is your Total Daily Energy Expenditure</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BmrInfo;
