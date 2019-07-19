const Nexmo = require('nexmo');
const express = require('express');
const router = express.Router();
const restricted = require('../authentication/restricted-middleware');

const nexmo = new Nexmo({
  apiKey: '53b35b88',
  apiSecret: '7ksUTaUWBQPUGn5y'
}, { debug: true })

router.post('/send-text', (req, res) => {
  const number = req.body.number
  const text = req.body.text + "\n \n" + "x"
  // const io = req.app.get('socketio')

  nexmo.message.sendSms(
    '18582862879',
    number,
    text,
    { type: 'unicode' },
    (err, responseData) => {
      if(err) {
        console.log(err)
      } else {
        console.dir(responseData)
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }

        // io.emit('smsStatus', data)
      }
    }
  )
  .then(res => res.send({ message: 'successful' }));
});



module.exports = router;