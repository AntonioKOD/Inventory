import decode from 'jwt-decode'

class AuthService {
    getProfile() {
        return decode(this.getToken())
    }

    loggedIn(){
        const token = this.getToken()
        return token && !this.isTokenExpired(token)
    }

    isTokenExpired(token){
        try{
            const decoded = decode(token)
            if(decoded.exp < Date.now() / 1000){
                localStorage.removeItem('id_token')
                return true
            }
            return false
        }catch(err){
            console.error('Token decoding failed', err)
            localStorage.removeItem('id_token')
            return false
        }
    }

    getToken(){
        return localStorage.getItem('id_token')
    }

    login(idToken){
        localStorage.setItem('id_token', idToken)
        console.log('Token Stored:', localStorage.getItem('id_token'))
        window.location.assign('/')
    }

    logout(){
        localStorage.removeItem('id_token')
        window.location.assign('/')
    }
}

export default new AuthService()