const randomGenerator = () => {
  return Math.random().toString(36).substring(2,6)
}

export default randomGenerator;