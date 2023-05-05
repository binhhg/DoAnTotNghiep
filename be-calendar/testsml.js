const { GoogleAuthProvider } = require('firebase-admin/auth')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

const accessToken = 'ya29.a0AWY7Ckl99MZ_BJSsiguXvrVSoiEi4pQWYENCPkRMXifChaskJ1Tbj5m89Rwd2MrnxS28mLIWLDLmTW2wCOWRAHB83PCEuBOf9Gx_bgZh9blZXkRJfTGIB3t3plUPr1dcFt3_vcDuc1041DG_wBGvfo-aUxlaaCgYKAeESARESFQG1tDrpcV3L-ivybyhtBBLCSdEG6Q0163'
const credential = GoogleAuthProvider.credentialFromAccessToken(accessToken)

admin.auth().signInWithCredential(credential)
  .then((userCredential) => {
    // Lấy Refresh Token
    const refreshToken = userCredential.refreshToken
    console.log(credential)
    // Sử dụng Refresh Token để gọi Google API
    // ...
  })
  .catch((error) => {
    // Xử lý lỗi đăng nhập
  })
