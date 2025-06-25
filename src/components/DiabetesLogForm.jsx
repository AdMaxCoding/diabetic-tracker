
import { useState } from "react";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc } from "firebase/firestore";
import { db } from "../../firebase";
import { setDoc } from "firebase/firestore";

export default function DiabetesLogForm(props){
const {isAuthenticated} = props
const [showModal, setShowModal] = useState(false)
const [bloodSugar, setBloodSugar] = useState('')
const [carbs, setCarbs] = useState('')
const [insulin, setInsulin] = useState('')
const [hour, setHour] = useState(0)
const [min, setMin] = useState(0)
const {globalData, setGlobalData, globalUser} = useAuth()

async function handleSubmitForm(){
    if (!isAuthenticated){
        setShowModal(true)
        return 
    }

    if (bloodSugar===""||carbs===""||insulin===""){
        return
    }
    const bs  = Number(bloodSugar);
    const cb  = Number(carbs);
    const ins = Number(insulin);

    // Block negatives and 0 blood sugar here
    if (bs <= 0 || cb < 0 || ins < 0) {
        console.warn("Blocked negative input", { bs, cb, ins });
        return;
    }
    try{
        const newGlobalData ={
        ...(globalData || {})
    }

    const nowTime = Date.now()
    const timeToSubtract = (hour * 60* 60 * 1000 )+(min*60*100)
    const timestamp = nowTime - timeToSubtract
    const newData = {bloodSugar: Number(bloodSugar), carbs: Number(carbs), insulin: Number(insulin)}
    newGlobalData[timestamp] = newData


    setGlobalData(newGlobalData)

    const userRef = doc(db, 'users', globalUser.uid)
    const res = await setDoc(userRef, {
        [timestamp] : newData
    }, {merge: true}
)
    setBloodSugar(0)
    setHour(0)
    setMin(0)
    setCarbs(0)
    setInsulin(0)


    }catch(err){
        console.log(err.message)

    }

    




    
}
    return(
        <>
        { showModal && (<Modal handleCloseModal={()=>{
                    setShowModal(false)
                }}>
                    <Authentication handleCloseModal={()=>{
                    setShowModal(false) }}/>
                </Modal>)}
        <div className="section-header">
            <i className="fa-solid fa-pencil"></i>
            <h2>Start tracking today</h2>
        </div>
        <h4>
            Enter Blood Sugar (mmol/L)
        </h4>

        <input className="w-full" type="number" value={bloodSugar} onChange={(e) => {setBloodSugar(e.target.value)}} placeholder="6.0"/>
        <h4>
            Enter Carb Amount (g)
        </h4>
        <input className="w-full" type="number" value={carbs} onChange={(e) => {setCarbs(e.target.value)}} placeholder="45"/>

        <h4>
            Enter Insulin Given (IU)
        </h4>
        <input className="w-full" type="number" value={insulin} onChange={(e) => {setInsulin(e.target.value)}} placeholder="8"/>
        <h4>Time since consumption</h4>

        <div className="time-entry">
            <div>
                <h6>Hours</h6>
                <select onChange={(e)=>{
                    setHour(e.target.value)
                }} id="hours-select">
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hour,hourIndex)=>{
                        return(
                            <option key={hourIndex} value={hour}>{hour}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <h6>Mins</h6>
                <select onChange={(e)=>{
                    setMin(e.target.value)
                }} id="mins-select">
                    {[0,5,10,15,20,30,45].map((min,minIndex)=>{
                        return(
                            <option key={minIndex} value={min}>{min}</option>
                        )
                    })}
                </select>
            </div>
        </div>
        <button onClick={handleSubmitForm}>
           <p>Add Entry</p> 
        </button>

        
        </>
    )
}