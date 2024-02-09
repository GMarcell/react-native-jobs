import { Text, View } from "react-native"
import {useRouter, Stack} from 'expo-router'

const Home = () => {
  const router = useRouter()
  return (
    <View>
      <Text>Hello</Text>
    </View>
  )
}

export default Home