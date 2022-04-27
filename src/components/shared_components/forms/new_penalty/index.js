
import { Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import React, { forwardRef, useEffect, useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';   
import {useStyles} from './style'
import BreadCrumb from '../../BreadCrump';
import "react-datepicker/dist/react-datepicker.css";
import {DropzoneArea} from 'material-ui-dropzone'
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Close } from '@material-ui/icons';
import { useDispatch,useSelector } from 'react-redux';
import ProgressSpinner from '../../ProgressBarSpinner'
import { getAllVehiclesPlateNumber } from '../../../../store/reducers/vehicle/vehicle.actions';
import { CLEAR_PENALTY_ERROR, CLEAR_PENALTY_MESSAGE } from '../../../../store/reducers/penalty/penalty.types';
import { setNewPenalty, updatePenalty } from '../../../../store/reducers/penalty/penalty.actions';
import { handleUpdateData, formatDate, removeNulls } from '../../../../utils/functions'
import { penaltyTextFields, cancelationStatus, paymentStatus } from '../../../../utils/constants'

export default function NewPenaltyForm(props) {

    const { isUpdate, data } = props;
    const classes = useStyles();
    const defaultInputData = (data !== null && data !== undefined)?data:{}
    console.log(defaultInputData)
    const [formInputData, setFormInputData] = useState({})
    const [plateNumber, setPlateNumber] = useState(
        ("vehicle" in defaultInputData)?{
            id: defaultInputData.vehicle.id,
            plate_number: defaultInputData.vehicle.plate_number
        }:{}
    );
    const [fileError, setFileError] = useState('')
    const [uploadedPdf, setUploadedPdf] = useState(null)
    const [penaltyImage, setPenaltyImage] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const penaltyReducer = useSelector((state) => state.penaltyReducer)
    const authReducer = useSelector((state) => state.authReducer)
    const vehicleReducer = useSelector((state) => state.vehicleReducer)
    const textFields = penaltyTextFields



    useEffect(() => {
        
        dispatch(getAllVehiclesPlateNumber())
    }, [])

    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        },
        {
            url:"/ceza", 
            name: "Ceza"
        },
        {
            url:"/ceza-ekle", 
            name: "Yeni Ceza Ekle"
        }
        
    ]


   


    const handleFileChange = (files) => {
        setUploadedPdf(files["0"])
    }

    const handlePenaltyImageChange = (files) => {
        setPenaltyImage(files["0"])
    }

    
    const handleInputChange = (inputName, inputValue)=> {
        const data = formInputData
        data[inputName] = inputValue
        setFormInputData(data)
    }
    const onSubmit = (e)=> {
        e.preventDefault()
        let data = formInputData
        if(data === {} && defaultInputData !== {}){
            showSnackBar("No data has been editted", "info")
            return
        }else if(data !== {} && defaultInputData !== {}){

            //if the state is not empty and there are default values, 
            //then add un-updated-default-values to data
            const __defaultInputData = handleUpdateData(defaultInputData)
            for (const key in __defaultInputData) {

                if(!(key in data)) {
                    data[key] = __defaultInputData[key]
                }

            }
        }else if(data === {} && defaultInputData === {}){
            showSnackBar("Cannot add empty data", "error")
            return
        }

        if(plateNumber === '') {
            showSnackBar("Plate Number is required", "error")
            return
        }
        
                    
        const formData = new FormData()
        const __data = removeNulls(data)
        console.log(__data)
        for (const key in __data) {
            formData.append(key, __data[key])
        }

        if(!isUpdate) {

            console.log(uploadedPdf)
            if( uploadedPdf !== null && uploadedPdf !== undefined) {

                if(("name" in uploadedPdf)) {
    
                    formData.append('pdf', uploadedPdf,uploadedPdf.name)
                }
            }
        }

        if(isUpdate) {

            if( penaltyImage !== null && penaltyImage !== undefined) {

                if(("name" in penaltyImage)) {
                    
                    formData.append('image', penaltyImage,penaltyImage.name)
                }
            }
        }

        
        if('id' in authReducer.data) {
    
            if(isUpdate) {

                dispatch(updatePenalty((formData), authReducer.data.id, defaultInputData.id))
            }else {
                dispatch(setNewPenalty(formData, authReducer.data.id, navigate))
            }
        }


    }

    if(penaltyReducer.message) {
      showSnackBar(penaltyReducer.message, 'success');
      dispatch({ type: CLEAR_PENALTY_MESSAGE})
    }

    if(penaltyReducer.error) {

        if("errors" in penaltyReducer.error) {
            for (const key in penaltyReducer.error.errors) {

                showSnackBar(penaltyReducer.error.errors[key]["0"], 'error');
                
            }
        }else if("error" in penaltyReducer.error) {

            showSnackBar(penaltyReducer.error.error, 'error');
        }

        
        dispatch({ type: CLEAR_PENALTY_ERROR})
    }

    function showSnackBar(msg, variant = 'info'){
        enqueueSnackbar(msg, {
            variant: variant,            
            action: (key) => (
                <IconButton style={{color: '#fff'}} size="small" onClick={() => closeSnackbar(key)}>
                    <Close />
                </IconButton>
            ),
        })
    }

    const getTextInputValue = (name)=> {
        return (data !== null && data !== undefined)?data[name]:''
    }
 
    return (

        <>
            
            {
                isUpdate?
                <></>
                :
                <BreadCrumb links={links} />
            }
            <Paper className={isUpdate?classes.root1:classes.root} >

                
                <form onSubmit={onSubmit}>
                    <Typography className={classes.header}>YENI CEZA EKLE</Typography>
                    <Grid 
                        container 
                        spacing={2}
                    >
                        

                            
                            {
                                textFields.map((item, index)=>(

                                    <Grid 
                                        item 
                                        xs={12}
                                        key={index}                                
                                    >
                                        <TextField 
                                            label={item.placeholder} 
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            className= {classes.textfield}
                                            fullWidth
                                            defaultValue={getTextInputValue(item.name)}
                                            onChange={(e)=>handleInputChange(item.name, e.target.value)}
                                            // {...register(item.name, { required: true })}
                                        />
                                        {/* {errors[item.name] && <span>This field is required</span>} */}
                                    </Grid>
                                ))
                            }

                            <Grid
                                item
                                xs={12}
                                >
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-cancelation_status-label">İPTAL DURUM</InputLabel>
                                        <Select
                                            name="cancelation_status"
                                            labelId="demo-cancelation_status-label"
                                            id="demo-cancelation_status-select"                                          
                                            onChange={(e)=>handleInputChange('cancelation_status', e.target.value)}
                                            value={formInputData.cancelation_status}
                                            defaultValue={getTextInputValue('cancelation_status')}  
                                        >

                                            {
                                                cancelationStatus.map((item,index)=>(
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                >
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-label">ÖDEME DURUMU</InputLabel>
                                        <Select
                                            name="status"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // {...register('status',{ required: true })}                                            
                                            onChange={(e)=>handleInputChange('status', e.target.value)}
                                            value={formInputData.status}
                                            defaultValue={getTextInputValue('status')}  
                                        >

                                            {
                                                paymentStatus.map((item,index)=>(
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        {/* {errors["status"] && <span>This field is required</span>} */}
                                    </FormControl>
                            </Grid>


                                {
                                    
                                    (!isUpdate)?

                                        <Grid
                                            item 
                                            xs={12}
                                        >

                                            <Typography variant="h6" className={classes.label} style={{marginBottom: '10px'}}>Upload Image</Typography>


                                                <DropzoneArea
                                                    acceptedFiles={['application/pdf']}
                                                    showPreviews={true}
                                                    useChipsForPreview
                                                    showPreviewsInDropzone={false}
                                                    maxFileSize={5000000}
                                                    filesLimit={1}
                                                    dropzoneText="PDF belgesini buraya sürükleyip bırakın"
                                                    onChange={handleFileChange}
                                                />
                                                <span>{fileError}</span>
                                            

                                        </Grid>

                                    :
                                    
                                    <Grid
                                        item 
                                        xs={12}
                                    >

                                        <Typography variant="h6" className={classes.label} style={{marginBottom: '10px'}}>PDF document</Typography>


                                            <DropzoneArea
                                                acceptedFiles={['image/*']}
                                                maxFileSize={5000000}
                                                filesLimit={1}
                                                dropzoneText="Resmi sürükleyip bırakın"
                                                onChange={handlePenaltyImageChange}
                                            />
                                        

                                    </Grid>
                                }

                            

                    </Grid>

                    <Grid
                        container            
                        direction="column"
                        alignItems="center"
                        justify="center"
                >
                    <Grid item xs={8}>
                        <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} >
                            
                            {penaltyReducer.loading ? <ProgressSpinner />: "Kaydet"}
                        </Button>

                    </Grid>
                    </Grid>
            
                </form>
            </Paper>
        </>
    );


    
}
