import React, { Component } from "react";
// common component
import {
    Text,
} from "native-base";
import {
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Alert,
    Picker,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {UserGrade} from './../utils/UserUtils';
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils';
import styles from '../css/css';

export default class FriendListSc extends Component {
    constructor(props) {
        console.info("FriendListSc => constructor");

        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            option:"all",
            getFirend:[],
            getFilterFirend:[],
            getFirendOn:[],
            getFirendOff:[],
            modalVisible:true,
            refreshButton:false,
            onCount:0,
            offCount:0,
            allCount:0
        };
    }

    UNSAFE_componentWillMount() {
        console.info("FriendListSc => componentWillMount");
        this.getFirend();
    }

    componentWillUnmount() {
        console.info("FriendListSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("FriendListSc => componentDidMount");
    }

    async getFirendOn(offSet)
    {
        const responseOn = await fetch(`https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset=${offSet}`, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        resolve(responseOn.json()));
    }

    async getFirendOff(offSet)
    {
        const responseOff = await fetch(`https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset=${offSet}`, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        resolve(responseOff.json()));
    }

    getFirend()
    {
        let offSet = 0;
        let onCount  = 0;
        let offCount = 0;
        
        let promiseOn;
        let promiseOff;

        this.setState({
            getFirend:[],
            getFirendOn:[],
            getFirendOff:[],
        })

        for(let i=0;i<10;i++)
        {
            promiseOn = Promise.all([this.getFirendOn(offSet)])
            .then((result) => {
                this.setState({
                    getFirendOn     : this.state.getFirendOn.concat(result[0]),
                    getFirend       : this.state.getFirend.concat(result[0]),
                    onCount         : onCount += result[0].length
                });
            });

            offSet+=100;
        }

        promiseOn.done(() => {
            offSet = 0;
            for(let i=0;i<10;i++)
            {
                promiseOff = Promise.all([this.getFirendOff(offSet)])
                .then((result) => {
                    this.setState({
                        getFirendOff    : this.state.getFirendOff.concat(result[0]),
                        getFirend       : this.state.getFirend.concat(result[0]),
                        offCount        : offCount += result[0].length
                    });
                });
                
                offSet+=100;
            }

            promiseOff.done(() => {
                this.setState({
                    modalVisible:false
                });
            })
        });
    }

    filter = value => {
        console.log("FriendListSc => filter");
        this.setState({
            option:value
        });
    }

    search=()=>{
        console.log("FriendListSc => search");
        let serachCheck;

        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                '오류',
                '검색어를 입력해주세요.',
                [{text: "확인"}]
            );
        }
        else
        {
            if(this.state.getFirend != null)
            {
                if(this.state.option == "on")
                {
                    serachCheck = this.state.getFirendOn.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
                }
                if(this.state.option == "off")
                {
                    serachCheck = this.state.getFirendOff.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
                }
                if(this.state.option == "all")
                {
                    serachCheck = this.state.getFirend.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
                }
            }
            if(serachCheck.length == 0)
            {
                Alert.alert(
                    '오류',
                    '검색결과가 존재하지 않습니다.',
                    [{text: "확인"}]
                );
            }
            else
            {
                this.setState({
                    searchMode:"0",
                    getFilterFirend:serachCheck
                });
        
                this.flist();
            }
        }
    }

    flist(){

        if(this.state.getFilterFirend != null && this.state.searchMode == "0")
        {
            return <FlatList
                style={styles.friendListCon}
                data={this.state.getFilterFirend}
                onRefresh={this.reset.bind(this)}
                refreshing={this.state.refreshing}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={[{backgroundColor:UserGrade(item.tags)},styles.friendList]}
                    >
                        <View style={styles.friendListView}>
                            <View>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:10}}
                                    source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                                />
                            </View>
                            <Text style={styles.friendInfoText}>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                {item.statusDescription != "" && item.statusDescription+"\n"}
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }

        if(this.state.option == "all")
        {
            return <FlatList
                style={styles.friendListCon}
                data={this.state.getFirend}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={[{backgroundColor:UserGrade(item.tags)},styles.friendList]}
                    >
                        <View style={styles.friendListView}>
                            <View>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:10}}
                                    source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                                />
                            </View>
                            <Text style={styles.friendInfoText}>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                {item.statusDescription != "" && item.statusDescription+"\n"}
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "on")
        {
            return <FlatList
                style={styles.friendListCon}
                data={this.state.getFirendOn}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={[{backgroundColor:UserGrade(item.tags)},styles.friendList]}
                    >
                        <View style={styles.friendListView}>
                            <View>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:10}}
                                    source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                                />
                            </View>
                            <Text style={styles.friendInfoText}>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                {item.statusDescription != "" && item.statusDescription+"\n"}
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "off")
        {
            return <FlatList
                style={styles.friendListCon}
                data={this.state.getFirendOff}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={[{backgroundColor:UserGrade(item.tags)},styles.friendList]}
                    >
                        <View style={styles.friendListView}>
                            <View>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:10}}
                                    source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                                />
                            </View>
                            <Text style={styles.friendInfoText}>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                {item.statusDescription != "" && item.statusDescription+"\n"}
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
    }
    
    reset(){
        console.log("FriendListSc => reset");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getFirend()])
            .then(() => {
                this.setState({
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
                searchMode:"1",
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    resetButton(){
        console.log("FriendListSc => resetButton");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.refreshButton = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getFirend()])
            .then(() => {
                this.setState({
                    modalVisible: false
                });
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
            });

            this.setState({
                refreshing:false,
                searchMode:"1",
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    render() {
        console.info("FriendListSc => render");

        this.state.allCount = this.state.onCount + this.state.offCount;

        return (
            <View style={{flex:1}}>
                <View style={styles.logo}>
                    <Text style={{fontFamily:"NetmarbleM",color:"white"}}>친구목록</Text>
                    <View  style={{position:"absolute",right:"5%"}}>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                    </View>
                </View>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:"2%",marginRight:"2%"}}>
                        <Text style={{textAlignVertical:"bottom",fontFamily:"NetmarbleL",color:"#2b3956"}}>전체 {this.state.allCount} 명</Text>
                        <View style={{borderBottomWidth:1,width:"60%",flexDirection:"row",justifyContent:"space-between"}}>
                            <TextInput 
                                value={this.state.search}
                                onChangeText={(text) => this.setState({search:text})}
                                onSubmitEditing={this.search}
                                placeholder={"이름 검색"}
                                style={{width:"80%",height:50,fontFamily:"NetmarbleL"}}/>
                            <Icon 
                                onPress={this.search}
                                name="magnifying-glass" size={25} style={{marginTop:15,color:"#3a4a6d"}}/>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:"2%",marginRight:"2%",height:70}}>
                        <Text style={{textAlignVertical:"center",fontFamily:"NetmarbleL",color:"#2b3956"}}>온라인 {this.state.onCount} 명</Text>
                        <View style={styles.selectView}>
                            <Picker 
                                selectedValue = {this.state.option}
                                onValueChange= {this.filter}
                            >
                                <Picker.Item label = "모두보기" value = "all" />
                                <Picker.Item label = "온라인" value = "on" />
                                <Picker.Item label = "오프라인" value = "off" />
                            </Picker>
                        </View>
                    </View>
                    {this.flist()}
                </ScrollView>
                <Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
            </View>
        );
    }
}