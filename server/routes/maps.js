const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { querySearch } = req.body
  console.log(querySearch)
  try {
    // const response = await axios.get(
    //   "https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=AIzaSyBC6_pnd8MbqJgLAd1GTukjXKyj6gALbsc&input=" +
    //     querySearch
    // );
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
        querySearch +
        `&key=${process.env.GOOGLE_KEY}`
    )
    const results = response.data
    res.send(results)
  } catch (err) {
    res.send(err)
  }
})

module.exports = router
