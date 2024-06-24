const firebase = require('firebase/app')
require('firebase/auth')
const catchAsync = require('../../utils/catch-async')

var that = (module.exports = {
    loginWithGoogle: catchAsync(async (req, res) => {
        const provider = new firebase.auth.GoogleAuthProvider()

        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const token = result.credential.accessToken
                // The signed-in user info.
                const user = result.user
                return res.status(200).json({ token, user })
            })
            .catch((error) => {
                return { error: error.message }
            })
    }),
})
