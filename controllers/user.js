const getUser = async (req, res) => {
  const { 
    email, 
    password 
  } = req.body;
  try {
    const user = await authAPI.loginUser({ email, password });
    res.send(user)
  } catch(error) {
    res.status(404).send({
      message: error.message
    })
  }

}