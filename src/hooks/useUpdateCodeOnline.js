import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../constants';
import Netinfo from '@react-native-community/netinfo';

const useUpdateCodeOnline = async (code, question, answer) => {
  const username = await AsyncStorage.getItem('username');
  const info = await Netinfo.fetch();
  const isConnected = info.isConnected;
  if (!isConnected || !username || username == '') {
    return;
  }

  try {
    const response = await fetch(`${url}/sync/update-code/${JSON.parse(username)}`, {
      method: 'PUT',
      headers:{"content-type":"application/json"},
      body:JSON.stringify({code,question,answer})
    });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (e) {
    console.log('Cannot update code online' + e.message);
  }
};

export default useUpdateCodeOnline;
