const user = process.env.USER_URL || 'http://localhost:8000'
const calendar = process.env.USER_URL || 'http://localhost:8001'

const ApiConfig = {
    user,
    calendar
}
export default ApiConfig
