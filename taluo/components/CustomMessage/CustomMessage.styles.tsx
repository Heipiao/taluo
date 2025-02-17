// CustomMessage.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonMessageContainer: {
    padding: 10,
    backgroundColor: 'transparent', // 设置为透明背景
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageMessageContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  textMessageContainer: {
    padding: 10,
    backgroundColor: '#e1ffc7',
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default styles;
