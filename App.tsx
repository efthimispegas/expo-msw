import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import "react-native-url-polyfill/auto";
import { shuffleList } from "./src/utils";
import server from "./src/devServer";
import Shimmer from "./src/Shimmer";

if(process.env.EXPO_PUBLIC_MSW === 'true') {
  server.listen({onUnhandledRequest:"bypass"});
  console.log('==================================');
  console.log('======== Running with MSW ========');
  console.log('==================================');
}

type User = {
  name: {
    first: string,
    last: string
  },
  picture: {
    large: string
  },
  phone: string,
  login:{
    uuid: string
  }
}

export default function App() {

  const [refreshing, setRefreshing] = React.useState(false);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BASE_URL}?take=8`)
        .then(data => data.json())
        .then((res) => {
          setUsers(res.results);
        });
  }, []);

  const onRefresh = React.useCallback(() => {

    setRefreshing(true);

    fetch(`${process.env.EXPO_PUBLIC_BASE_URL}?take=8`)
        .then(data => data.json())
        .then((res) => {

          const shuffled: [] = shuffleList(res.results);

          setUsers(shuffled);
          setTimeout(() => {
            setRefreshing(false);
          }, 2000);
        });
  }, []);

  return (
      <View>
        <StatusBar/>
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
          {users.map((user: User) => (
              refreshing ? (
              <View key={user.login.uuid} style={styles.skeleton}>
                <View style={styles.avatar}>
                  <Shimmer width={50} height={50} />
                </View>
                <View style={styles.userCardRight}>
                  <Shimmer width={200} height={14} />
                  <Shimmer width={150} height={11} />
                </View>
              </View>) : (
              <View key={user.login.uuid} style={styles.userCard}>
                <Image
                style={styles.userImage}
                source={{uri: user.picture?.large}}
                />
                <View style={styles.userCardRight}>
                  <Text style={{fontSize: 18, fontWeight: '500', color: '#fff'}}>
                    {`${user.name.first} ${user.name.last}`}
                  </Text>
                  <Text style={{color: '#fff'}}>{`${user?.phone}`}</Text>
                </View>
              </View>)
          ))}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 10,
    paddingTop: "10%",
  },
  avatar: {
    borderRadius: 30,
    width: 40,
    height: 40,
    overflow: 'hidden',
  },
  userCard: {
    justifyContent:"space-between",
    backgroundColor: 'lightblue',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeleton: {
    justifyContent:"space-between",
    backgroundColor: 'lightgrey',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
});
