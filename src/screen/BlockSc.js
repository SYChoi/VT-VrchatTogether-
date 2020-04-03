import React, { Component } from "react";
// common component
import {
    Container,
    Header,
    Content,
    Footer,
    Button,
    Left,
    Right,
    Body,
    Item,
    Label,
    Input,
    H2,
    H1,
    Badge,
    Text,
    SwipeRow,
    Picker,
    Textarea,
    Fab,
    List,
    ListItem,
    Switch,
    Drawer
} from "native-base";
import {
    Image,
    StyleSheet,
    SectionList,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Dimensions,
    Alert,
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';

export default class BlockSc extends Component {
    constructor(props) {
        console.info("BlockSc => constructor");

        super(props);

        this.state = {
            
        };
    }

    UNSAFE_componentWillMount() {
        console.info("BlockSc => componentWillMount");
    }

    componentWillUnmount() {
        console.info("BlockSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("BlockSc => componentDidMount");
    }

    render() {
        console.info("BlockSc => render");
        
        return (
            <View style={{flex:1}}>
                <View style={styles.logo}>
                    <Text>블락 관리</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    login: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    textView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"80%",
        flexDirection:"row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }
});