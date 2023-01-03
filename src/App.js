import logo from './logo.svg';
import './App.css';
// import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/facemesh'
import * as posedetection from '@tensorflow-models/pose-detection';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState, useContext } from 'react';
import * as tf from '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import { Container, Grid, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button, Select, MenuItem } from '@mui/material';
import PictureList from './PictureList';
import videokata1 from './video/kamera_depan.mp4'
import videokata1side from './video/kamera_samping.mp4'
import {downloadFile} from './utils/downloadFile'
import { CSVLink } from "react-csv"
import { PoseContext } from "./Context/index"

function App() {

  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const canvasSnapRef = useRef(null)

  const webcamRef2 = useRef(null)
  const canvasRef2 = useRef(null)
  const canvasSnapRef2 = useRef(null)

  const { dataPoses, excelExport, addPose, deletePose } = useContext(PoseContext)
  
  const [takeList,setTakeList]=useState([]);
  const [imageScreenShoot,setImageScreenShoot]=useState("");
  const canvasScreenShootRef = useRef([])
  const [dataPoseScreenShoot, setDataPoseScreenShoot] = useState([])

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  const changeData = (e, id)=>{
    const changeData = takeList.map(item=>{
      if(id === item.id){
        return {...item, label: e.target.value}
      }
      else{
        return item
      }
    })
    setTakeList(changeData)
  }

  const [playStatus, setPlayStatus] = useState(null)

  const deletedata = (id)=>{
    const changeData = takeList.filter(x=>x.id !== id)
    deletePose(id)
    setTakeList(changeData)
  }

  const [chooseVideo, setChooseVideo] = useState("1")
  const [chooseVideo2, setChooseVideo2] = useState("2")
  const [displayImage, setDisplayImage] = useState(true)

  const takePicture1 = ()=>{
    const video = webcamRef.current
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    video.width = videoWidth
    video.height= videoHeight

    canvasSnapRef.current.width = videoWidth
    canvasSnapRef.current.height = videoHeight
    var ctxSnap = canvasSnapRef.current.getContext("2d");
    ctxSnap.drawImage(video, 0, 0, canvasSnapRef.current.width, canvasSnapRef.current.height);
    var dataURI = canvasSnapRef.current.toDataURL('image/jpeg'); // can also use 'image/png'
    console.log('dataURI', dataURI)

    // setImageScreenShoot(dataURI)

    // let dataTake = {id: makeid(10), img: dataURI}
    // let dataConcat = [...takeList, dataTake]
    // setTakeList(dataConcat)
    return dataURI
  }

  const takePicture2 = ()=>{
    const video = webcamRef2.current
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight

    video.width = videoWidth
    video.height= videoHeight

    canvasSnapRef2.current.width = videoWidth
    canvasSnapRef2.current.height = videoHeight
    var ctxSnap = canvasSnapRef2.current.getContext("2d");
    ctxSnap.drawImage(video, 0, 0, canvasSnapRef2.current.width, canvasSnapRef2.current.height);
    var dataURI = canvasSnapRef2.current.toDataURL('image/jpeg'); // can also use 'image/png'
    return dataURI
    // let dataTake = {id: makeid(10), img: dataURI}
    // let dataConcat = [...takeList, dataTake]
    // setTakeList(dataConcat)
  }

  return (
    <div>
      <Container maxWidth="xl">
        
        <Grid container spacing={2}>
          <Grid item xs={5} sm={5} md={5}>
            <center>
              <Typography>Pilih Video Source : </Typography>
              <Select value={chooseVideo} onChange={e=>setChooseVideo(e.target.value)}>
                <MenuItem value="1">Video Kata 1 - Front</MenuItem>
                <MenuItem value="2">Video Kata 1 - Side</MenuItem>
                <MenuItem value="3">Video Kata 2 - Front</MenuItem>
                <MenuItem value="4">Video Kata 2 - Side</MenuItem>
              </Select>
              <div style={{position:"relative", border:"1px solid #000", width:800, height:420, textAlign:'center'}}>
                <video ref={webcamRef} 
                  // src="https://drive.google.com/file/d/1EOq5XhGlA3UCc4aPjIslZW7WmfzJOULi/preview?pli=1" 
                  src={
                    chooseVideo === "1" ? videokata1 :
                    chooseVideo === "2" ? videokata1side :
                    videokata1}
                  screenshotFormat="image/jpeg"
                  controls
                  style={{
                    position:'absolute',
                    width:800, height:420,
                    top:0, left:0,
                    zIndex:10,
                    textAlign:'center'
                  }}
                />
                <canvas ref={canvasRef} style={{
                  position:'absolute',
                  width:800, height:420,
                  top:0, left:0,
                  zIndex:9,
                  textAlign:'center'
                }}
                />
                <canvas ref={canvasSnapRef} style={{
                  position:'absolute',
                  border:"1px solid #000",
                  width:800, height:420,
                  top:0, left:0,
                  zIndex:8,
                  textAlign:'center'
                }}
                />
              </div>
             
            </center>
            
          </Grid>
          <Grid item xs={2} sm={2} md={2}>

          </Grid>
          <Grid item xs={5} sm={5} md={5}>
            <center>
              <Typography>Pilih Video Source : </Typography>
              <Select value={chooseVideo2} onChange={e=>setChooseVideo2(e.target.value)}>
                <MenuItem value="1">Video Kata 1 - Front</MenuItem>
                <MenuItem value="2">Video Kata 1 - Side</MenuItem>
                <MenuItem value="3">Video Kata 2 - Front</MenuItem>
                <MenuItem value="4">Video Kata 2 - Side</MenuItem>
              </Select>
              <div style={{position:"relative", border:"1px solid #000", width:800, height:420, textAlign:'center'}}>
                <video ref={webcamRef2} 
                  // src="https://drive.google.com/file/d/1EOq5XhGlA3UCc4aPjIslZW7WmfzJOULi/preview?pli=1" 
                  src={
                    chooseVideo2 === "1" ? videokata1 :
                    chooseVideo2 === "2" ? videokata1side :
                    videokata1}
                  screenshotFormat="image/jpeg"
                  controls
                  style={{
                    position:'absolute',
                    width:800, height:420,
                    top:0, left:0,
                    zIndex:10,
                    textAlign:'center'
                  }}
                />
                <canvas ref={canvasRef2} style={{
                  position:'absolute',
                  width:800, height:420,
                  top:0, left:0,
                  zIndex:9,
                  textAlign:'center'
                }}
                />
                <canvas ref={canvasSnapRef2} style={{
                  position:'absolute',
                  border:"1px solid #000",
                  width:800, height:420,
                  top:0, left:0,
                  zIndex:8,
                  textAlign:'center'
                }}
                />
              </div>
            </center>
            
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
              <center>
              {
                !playStatus ? 
                <Button variant="contained" color="primary" onClick={()=>{
                  const video = webcamRef.current;
                  video.play()

                  const video2 = webcamRef2.current;
                  video2.play()

                  setPlayStatus(true)
                }}>Play</Button>
                :
                <Button variant="contained" color="primary" onClick={()=>{
                  const video = webcamRef.current;
                  const video2 = webcamRef2.current;
                  video.pause()
                  video2.pause()
                  setPlayStatus(false)
                }}>Pause</Button>
              }

              <Button variant="contained" color="primary" style={{marginLeft:5, marginRight:5}} onClick={async()=>{
                let data1 = await takePicture1()
                let data2 = await takePicture2()
                setTakeList([...takeList,  {id: makeid(10), img: data1}, {id: makeid(10), img: data2}])

              }}>Take Screenshot</Button>

              </center>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
          {/* <img src={imageScreenShoot} style={{position:'absolute', width:200, height:190, zIndex:10}} /> */}
            {
              takeList.map((itemTake,index)=>{
                return <PictureList displayImage={displayImage} deletedata={()=>deletedata(itemTake.id)} change={e=>changeData(e, itemTake.id)} label={itemTake.label} video={webcamRef.current} data={itemTake} index={index}/>
              })
            }
          </Grid>

        </Grid>
      </Container>
    </div>
  );
}

export default App;
