import { Dimensions, StyleSheet } from 'react-native';
const balooR="Baloo2-Regular"
const balooB="Baloo2-Bold"
export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  bigLetter: {
    fontSize: 100,
    color: '#000000',
    fontFamily:"JuliusSansOne-Regular"
    
  },
  rightText: {
    color: '#000000',
    justifyContent: 'center',
  },
  smallText: {
    fontSize: 40,
    color: '#000000',
    fontFamily:"JuliusSansOne-Regular",
  },
  loginImage: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 10,
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#D9DDDD',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 3,
    borderColor: '#BDB8B8',
    fontFamily:balooR

  },
  loginButton: {
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: '#98F3F3',
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:"center",
    gap:5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  loginText: {
    color: '#150E65',
    fontSize: 18,
    fontFamily:balooR
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color:"black",
    marginLeft: 10,
    fontFamily:balooB
  },
  newDiaryCard: {
    backgroundColor: '#FFDDDD',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
  },
  newDiaryText: {
    fontFamily:balooB,
    fontSize: 20,
    color: '#000000',
    fontWeight: '500',
  },
  diaryIcon: {
    width: 100,
    height: 100,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize:16,
    fontFamily:balooR

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: 'black',
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    paddingHorizontal: 10,
    marginBottom: 20,
    position:"relative"
  },
  recentIcon: {
    width: 80,
    height: 80,
    marginRight: 20,
    resizeMode: 'contain',
  },
  recentText: {
    flex: 1,
    fontSize: 18,
    color:"black",
     fontFamily:balooR
    },
    dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#F3F6C9',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
  },
  titleInput: {
    backgroundColor: '#F3F6C9',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    fontSize: 20,
    marginTop:22,
    color:"#635C5C",
    fontFamily:balooB
  },
  dateInput:{
    color:"#635C5C",
    fontSize:16,
    fontFamily:balooR
},

  webViewContainer: {
   height:Dimensions.get("window").height - 320,
    width:"100%",
    marginTop: 16,

    borderRadius: 8,
    overflow: 'hidden',
  },
  webView: {
 height:Dimensions.get("window").height - 320,
    width:"100%"
  },

  saveBtn:{
    backgroundColor:"#FA9595",
    borderRadius:5,
    padding:5,
    marginBottom:5
  },
  saveBtnTxt:{
    color:"white",
    fontSize:20
  },
  noteHeader:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  deleteNoteBtn:{
    backgroundColor:"red",
    height:"100%",
    position:"absolute",
    right:0,
    alignItems:"center",
    justifyContent:"center",
    padding:5,
    width:100,
    zIndex:99,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
  },
  form:{
    backgroundColor:"white",
    borderRadius:10,
    padding:20
  },
  row:{
    flexDirection:"row",
    alignItems:"center",
    gap:10,
    marginBottom:20,
    borderBottomColor:"#A6AEBF",
    borderBottomWidth:1
  },
  lockInput:{
    backgroundColor:"transparent",
    fontSize:18,
    fontFamily:balooR,
    width:"100%",
    color:"gray"
  },
  question:{
    fontSize:20,
    marginBottom:20
  },
  homeIg:{
    width:200,
    height:200,
    alignSelf:"center",
    backgroundColor:"white",
    borderRadius:100,
    marginBottom:20
  },
  error:{
    color:"red",
    fontFamily:balooR,
    fontSize:16
  },
    bannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});
