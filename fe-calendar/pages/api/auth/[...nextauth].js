import NextAuth from 'next-auth'
import axios from 'axios'
import GoogleProvider from 'next-auth/providers/google'
import {useRouter} from "next/router";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
            clientSecret: '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',
            authorization: {
                params: {
                    scope: 'email profile https://www.googleapis.com/auth/calendar',
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            if (account.provider === 'google') {
                try {
                    // // Gọi API sang backend để xử lý đăng nhập
                    // const response = await axios.post('http://localhost:9000/user/login', {
                    //     user: user,
                    //     account: account,
                    //     profile: profile
                    // })

                    const obj = {user, account, profile}


                    // Xử lý phản hồi từ backend (nếu cần)
                    // console.log('Phản hồi từ backend:', response.data)
                    return `/test?q=${user.id}&abc=2`
                } catch (error) {
                    // Xử lý lỗi
                    console.error('Lỗi khi gọi API đăng nhập tới backend:', error)
                    return '/test?res=aqqd'
                }
            }
            return true // Do different verification for other providers that don't have `email_verified`
        }
    },
    theme: {
        logo: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg'
    }
})
