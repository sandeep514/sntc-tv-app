import React from 'react';
import Navigation from './Navigation';

export default function App() {
  return <Navigation></Navigation>;
}
const styles = {
  buttonsContainer: {
    display: 'flex',
  },
  container: {
    flex: 1,
    backgroundColor: '#bd9f5f',
  },
  state: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  basmatiCard: {
    backgroundColor: '#019340',
    margin: 10,
    borderRadius: 5,
    padding: 5,
    width: '30%',
  },
};
