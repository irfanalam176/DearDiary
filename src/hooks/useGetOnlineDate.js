import { url } from "../constants"
import { syncData } from "../database.service";


const useGetOnlineDate = async(username) => {
    try{
        const isDataExist = await syncData.checkDatabse()
        console.log(isDataExist);
        
        if(isDataExist==false){
            return
        }
        const response = await fetch(`${url}/sync/get-online-data/${username}`,{method:"GET"})
        const result = await response.json()
        await syncData.setDataOffline(result.data)
        return
        
        
    }catch(e){
        console.log("Cannot get online data" + JSON.stringify(e,null,2));
        
    }
}

export default useGetOnlineDate