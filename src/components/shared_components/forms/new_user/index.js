
import { Button,  Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react'
import {useStyles} from './style'
import BreadCrumb from '../../BreadCrump';
import {signUpTextfields} from '../../../../utils/constants';
import { useDispatch,useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { signUpUser } from '../../../../store/reducers/auth/auth.actions';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Close } from '@material-ui/icons';
import { CLEAR_ERROR, CLEAR_MESSAGE } from '../../../../store/reducers/auth/auth.types';

export default function NewUserForm(props) {

    const classes = useStyles();
    const dispatch = useDispatch()
    const { register, handleSubmit, formState:{ errors } } = useForm()
    const navigate = useNavigate()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const authState = useSelector((state) => state.authReducer)


    const onSubmit = (data)=> {
        //handleBackdropToggle()
        dispatch(signUpUser(data, navigate,false))
    }
    

    
    if(authState.message) {
        showSnackBar(authState.message, 'success');
        dispatch({ type: CLEAR_MESSAGE})
    }

    if(authState.error) {
        if("errors" in authState.error) {
            for (const key in authState.error.errors) {

                showSnackBar(authState.error.errors[key]["0"], 'error');
                
            }
        }else if("error" in authState.error) {

            showSnackBar(authState.error.error, 'error');
        }
        dispatch({ type: CLEAR_ERROR})
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

    const links = [
        {
            url:"/ana-sayfa", 
            name: "Anasayfa"
        },
        {
            url:"/personel", 
            name: "Kullanıcılar"
        },
        {
            url:"/personel-ekle", 
            name: "Yeni Kullanıcı Ekle"
        }
        
    ]


    return (

        <>
            
            <BreadCrumb links={links} />
            <Paper className={classes.root} >

                <Typography className={classes.header}>Yeni Kullanıcı Ekle</Typography>

                
                <form  onSubmit={handleSubmit(onSubmit)}>
                    <Grid 
                        container 
                        spacing={2}
                    >

                            
                            {
                                signUpTextfields.map((item, index)=>(

                                    <Grid 
                                        item 
                                        xs={12}
                                        key={index}                                
                                    >

                                        <TextField 
                                            required 
                                            label={item.placeholder} 
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            className= {classes.textfield}
                                            fullWidth
                                            type={item.type}
                                            {...register(item.name, { required: true })}
                                        />
                                        {errors[item.name] && <span>Bu alan gereklidir</span>}
                                    </Grid>
                                ))
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
                                Kaydet
                            </Button>

                        </Grid>
                    </Grid>

                </form>
            </Paper>
        </>
    );


    
}
