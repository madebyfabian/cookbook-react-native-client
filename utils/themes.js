import { useColorScheme } from "react-native-appearance"
import { registerThemes } from "react-native-themed-styles"


const light = { 
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F8F8'
  },
  content: {
    primary: '#252525',
    secondary: '#8C8C8C',
    action: '#0585AE'
  }
}

const dark = { 
  background: {
    primary: '#000000',
    secondary: '#121212'
  },
  content: {
    primary: '#FFFFFF',
    secondary: '#484848',
    action: '#7AD0EB'
  }
}

const styleSheetFactory = registerThemes({ light, dark }, () => {
  const colorScheme = useColorScheme()
  return 'light' //return ["light", "dark"].includes(colorScheme) ? colorScheme : "light"
})


export { 
  styleSheetFactory 
}