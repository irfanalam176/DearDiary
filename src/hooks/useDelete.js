import AsyncStorage from '@react-native-async-storage/async-storage'
import { url } from '../constants'
import Netinfo from "@react-native-community/netinfo"

const useDelete = async(id,table) => {
 
  const username = await AsyncStorage.getItem("username")
        const info = await Netinfo.fetch()
        const isConnected =  info.isConnected  
        if(!isConnected || !username || username == ""){
            return
        }
        
       try{
        const response = await fetch(`${url}/sync/sync-delete-online/${id}`,{
            method:"DELETE",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                table
            })
        })

        if(response.ok){
            return true
        }

       }catch(e){
        console.log("Cannot sync data" + e);
        
       }

}

export default useDelete