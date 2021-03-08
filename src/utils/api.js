const MOBILE_VERIFY_URL = 'https://plothookinator-sparrowhawk.vercel.app/api/mobile_verify'

export async function sendVerificationEmail (email, code, cb) {
  try {
    let response = await fetch(MOBILE_VERIFY_URL, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code }),
      redirect: 'follow',
    })
    let json = await response.json()

    if (json.body == 'success') {
      cb(false)
    } else {
      console.error(`Error sending email verification ${json}`)
      console.log(json)
      cb({message: 'Error sending email verification'})
    }
  } catch (error) {
    console.error(error)
    cb(error)
  }
}
