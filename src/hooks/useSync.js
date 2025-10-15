import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { syncData } from '../database.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { url } from '../constants'
import Netinfo from "@react-native-community/netinfo"
const useSync = async() => {

        const username = await AsyncStorage.getItem("username")
        const info = await Netinfo.fetch()
        const isConnected =  info.isConnected  
        if(!isConnected || !username || username == ""){
            return
        }
        
        const unSyncedData = await syncData.getUnsync()
        
       try{

        const response = await fetch(`${url}/sync/sync-online/${JSON.parse(username)}`,{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                username,
                unSyncedData
            })
        })

        if(response.ok){
           await syncData.setSync()
        }

       }catch(e){
        console.log("Cannot sync data" + e);
        
       }
       

    
}

export default useSync