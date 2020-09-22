const MOBILE_VERIFY_URL = 'https://plothookinator.sparrowhawk.vercel.app/api/mobile_verify'

export async function sendVerificationEmail (email, code, cb) {
  try {
    let response = await fetch(MOBILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    })
    let json = await response.json()

    if (json.body == 'success') {
      cb(false)
    } else {
      console.error(error)
      cb(error)
    }
  } catch (error) {
    console.error(error)
    cb(error)
  }
}
