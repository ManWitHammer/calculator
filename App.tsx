import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ToastAndroid, Platform, ScrollView, Dimensions, Animated, Pressable, Easing } from 'react-native'
import NumberOrSymbol from './shared/numberOrSymbol'
import SvgComponent from './assets/history'
import SvgBackspace from './assets/backspace'
import SvgCalculator from './assets/calculator'

export default function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [containerHeight, setContainerHeight] = useState(0)
  const [history, setHistory] = useState<{ result: string, input: string }[]>([])
  const [historyVisible, setHistoryVisible] = useState(false)

  const translateYAnim = new Animated.Value(0)
  const fontSizeAnim = new Animated.Value(28)
  const colorAnim = new Animated.Value(0)
  const opacityAnim = new Animated.Value(1)
  const backgroundColorAnim = new Animated.Value(0)
  const rotationAnim = new Animated.Value(0)

  Animated.loop(
    Animated.timing(rotationAnim, {
      toValue: 1,
      duration: 1000, 
      useNativeDriver: false,
      easing: Easing.linear,
    })
  ).start()

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], 
  })

  useEffect(() => {
    if (result) {
      animateResult()
    }
  }, [history])

  const animateResult = () => {
    Animated.timing(translateYAnim, {
      toValue: -155,
      duration: 400,
      useNativeDriver: false,
    }).start()
    Animated.timing(fontSizeAnim, {
      toValue: 45,
      duration: 400,
      useNativeDriver: false,
    }).start()
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start()
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setInput(result)
        setResult('')
        resetAnimation()
      }, 400)
    })
  }

  const sevondInterpolatedColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0.1)', '#2e2e2e'],
  })

  const fadeIn = () => {
    Animated.timing(backgroundColorAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const fadeOut = () => {
    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const resetAnimation = () => {
    Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start()
    Animated.timing(fontSizeAnim, {
      toValue: 28,
      duration: 0,
      useNativeDriver: false,
    }).start()
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: false,
    }).start()
    Animated.timing(colorAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start()
  }

  const handlePress = (value: string) => {
    let updatedInput = input

    if (value === '=') {
      if (result) {
        setHistory((prevHistory) => [{ input: updatedInput, result }, ...prevHistory])
      } else {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Недопустимый формат, увы', ToastAndroid.SHORT)
        }
      }
      return
    }

    if (value === 'С') {
      setResult('')
      setInput('')
      return
    }

    if (value === 'del') {
      updatedInput = updatedInput.slice(0, -1)
    } else {
      const lastChar = updatedInput.slice(-1)

      if ('+-*/%*^'.includes(value) && '+-*/%^'.includes(lastChar)) {
        return
      }

      if (value === '^') {
        value = '**'
      }

      updatedInput += value

      const numbers: string[] = []
      let currentNumber = '';

      [...updatedInput].forEach((char) => {
        if ('+-*/%^'.includes(char)) {
          if (currentNumber) {
            numbers.push(currentNumber)
            currentNumber = ''
          }
        } else {
          currentNumber += char
        }
      })

      if (currentNumber) {
        numbers.push(currentNumber)
      }

      if (numbers.some((num) => num.length > 12)) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Максимум 12 цифр в каждом числе!', ToastAndroid.SHORT)
        }
        return
      }
    }

    setInput(updatedInput)
    calculateResult(updatedInput, value)
  }

  const calculateResult = (input: string, value: string) => {
    if (!/[-+*/%^]/.test(input) || value === '=') {
      return
    }

    try {
      let evalResult = eval(input)
      if (typeof evalResult === 'number') {
        const formattedResult =
          evalResult.toString().length > 12 ? evalResult.toExponential(6) : evalResult.toString()
        setResult(formattedResult)
      }
    } catch (error) {
      setResult('')
    }
  }


  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#888', 'white']
  })

  return (
    <View style={styles.wrapper}>
      <View style={{...styles.topContainer, height: Dimensions.get('window').height - containerHeight + 30}}>
        <View style={styles.answerContainer}>
          <ScrollView>
            <Animated.Text style={
              {...styles.inputText, opacity: opacityAnim}
            }>{input}</Animated.Text>
          </ScrollView>
          <Animated.Text
            style={{
              ...styles.resultText,
              transform: [{ translateY: translateYAnim }],
              color: interpolatedColor,
              fontSize: fontSizeAnim
            }}
          >
            {result}
          </Animated.Text>
        </View>
        <View style={styles.forHistoryButton}>
          <View style={styles.buttons}>
          {historyVisible ? (
        <Pressable
          onPressIn={() => {
            fadeIn()
          }}
          onPressOut={() => {
            fadeOut()
            setHistoryVisible(!historyVisible)
          }}
          style={styles.button}
        >
          <Animated.View
            style={{
              ...styles.animatedView,
              backgroundColor: sevondInterpolatedColor,
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <SvgCalculator/>
          </Animated.View>
        </Pressable>
      ) : (
        <Pressable
          onPressIn={() => {
            fadeIn()
          }}
          onPressOut={() => {
            fadeOut()
            setHistoryVisible(!historyVisible)
          }}
          style={styles.button}
        >
          <Animated.View
            style={{
              ...styles.animatedView,
              backgroundColor: sevondInterpolatedColor,
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <SvgComponent />
          </Animated.View>
        </Pressable>
      )}
          </View>
          <View style={styles.bottomLine}></View>
        </View>
      </View>

      <View 
        style={styles.container}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          setContainerHeight(height)
        }}
      >
        {historyVisible ? (
          <ScrollView style={styles.historyContainer}>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyInput}>{item.input}</Text>
                <Text style={styles.historyText}>={item.result}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <>
            <NumberOrSymbol numberOrSymbol="С" bgColor="#2e2e2e" color="#f8676e" onPress={() => handlePress('С')} />
            <NumberOrSymbol numberOrSymbol="^" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('^')} />
            <NumberOrSymbol numberOrSymbol="%" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('%')} />
            <NumberOrSymbol numberOrSymbol="/" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('/')} />
            <NumberOrSymbol numberOrSymbol="7" onPress={() => handlePress('7')} />
            <NumberOrSymbol numberOrSymbol="8" onPress={() => handlePress('8')} />
            <NumberOrSymbol numberOrSymbol="9" onPress={() => handlePress('9')} />
            <NumberOrSymbol numberOrSymbol="*" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('*')} />
            <NumberOrSymbol numberOrSymbol="4" onPress={() => handlePress('4')} />
            <NumberOrSymbol numberOrSymbol="5" onPress={() => handlePress('5')} />
            <NumberOrSymbol numberOrSymbol="6" onPress={() => handlePress('6')} />
            <NumberOrSymbol numberOrSymbol="-" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('-')} />
            <NumberOrSymbol numberOrSymbol="1" onPress={() => handlePress('1')} />
            <NumberOrSymbol numberOrSymbol="2" onPress={() => handlePress('2')} />
            <NumberOrSymbol numberOrSymbol="3" onPress={() => handlePress('3')} />
            <NumberOrSymbol numberOrSymbol="+" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('+')} />
            <NumberOrSymbol numberOrSymbol="," onPress={() => handlePress('.')} />
            <NumberOrSymbol numberOrSymbol="0" onPress={() => handlePress('0')} />
            <NumberOrSymbol numberOrSymbol=<SvgBackspace/> onPress={() => handlePress('del')} />
            <NumberOrSymbol numberOrSymbol="=" bgColor="#2e2e2e" color="#69f988" onPress={() => handlePress('=')} />
          </>
        )}
      </View>
      <StatusBar style="light" backgroundColor="#010101" />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#010101',
    justifyContent: 'space-between',
  },
  historyContainer: {
    height: 455,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  historyItem: {
    padding: 5,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  historyInput: {
    color: '#fff',
    fontSize: 20,
  },
  historyText: {
    color: '#b8b8b8',
    fontSize: 16,
  },
  topContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  answerContainer: {
    height: 220,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  inputText: {
    fontSize: 45,
    color: '#fff',
  },
  resultText: {
    fontSize: 28,
    color: '#888',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
    padding: 20,
    justifyContent: 'center'
  },
  forHistoryButton: {
    flexDirection: "column",
    gap: 10
  },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  animatedView: {
    padding: 8,
    borderRadius: "50%",
  },
  bottomLine: {
    height: 3,
    width: "100%",
    backgroundColor: "#2e2e2e",
    borderRadius: 3
  }
})