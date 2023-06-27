import { storageService } from './async-storage.service'
import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    changeScore,
    getUserUrl,
    getUserName
}

window.userService = userService
const USER_KEY = 'user'

createDemoUsers()

async function createDemoUsers(){
    let users = await storageService.query('user')
    if (!users.length){
        users = demoUsers
        storageService._save(USER_KEY, users)
    }

}



function getUsers() {
    return storageService.query('user')
    // return httpService.get(`user`)
}

async function getUserUrl(id){
    const user = await getById(id)
    return user.imgUrl
}
async function getUserName(id){
    const user = await getById(id)
    return user.username
}



async function getById(userId) {
    const user = await storageService.get('user', userId)
    // const user = await httpService.get(`user/${userId}`)
    return user
}

function remove(userId) {
    return storageService.remove('user', userId)
    // return httpService.delete(`user/${userId}`)
}

async function update(userToUpdate, key) {
   
    const user = await storageService.get('user',userToUpdate._id)
    user[key] = userToUpdate[key]
    await storageService.put('user', user)

    // const user = await httpService.put(`user/${_id}`, {_id, score})
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query('user')

    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    // console.log('user:', user)
    if (user) {
        // socketService.login(user._id)
        return saveLocalUser(user)
    } else {
        throw new Error('couldnt find the user')
    }
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post('user', userCred)
    // const user = await httpService.post('auth/signup', userCred)
    // socketService.login(user._id)
    return saveLocalUser(user)
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // socketService.logout()
    // return await httpService.post('auth/logout')
}

async function changeScore(by) {
    const user = getLoggedinUser()
    if (!user) throw new Error('Not loggedin')
    user.score = user.score + by || by
    await update(user)
    return user.score
}


function saveLocalUser(user) {
    user = {_id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, username:user.username}
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}


// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()


 const demoUsers = [
    {
        _id:'tGJgU',
        fullname: 'ris benichou',
        username: 'ris',
        password:'ris',
        imgUrl:'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687784976/czw4gttnc1pvnmkaajw8.jpg'
    },
    {
        _id:'qXJvh',
        fullname: 'Mai Levi',
        username: 'mai',
        password:'mai',
        imgUrl:'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687787161/oxrc0qntq0fexc3nci7l.jpg'
    },
    {
        _id:'qXJvf',
        fullname: 'Jane Doe',
        username: 'jane',
        password:'jane',
        imgUrl:'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687190716/gps5k4scacs04qqlrjn2.jpg'
    },
    {
        _id:'iwrDvgJ',
        fullname: 'Jordan Kay',
        username: 'Jordan',
        password:'jordan',
        imgUrl:'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687725434/uzkxm7tnfuxvsrsruwq2.jpg'
    },
    {
        _id:'iwrDv',
        fullname: 'demo guest',
        username: 'guest',
        password:'guest',
        imgUrl:'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    },
    {
        _id:'iwrDvfff',
        fullname: 'Sharon Dan',
        username: 'Sharon - Coding Academy',
        password:'sharon',
        imgUrl:'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687768342/b8rrwer0n6aujpezsks2.jpg'
    },
    {
        _id:'abc123',
        fullname: 'mitch hokkings',
        username: 'mitch hawkings',
        password:'mitch',
        imgUrl:'https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174221/ozfn5c2uulrxaulrqoir.jpg'
    },
]





// https://res.cloudinary.com/dcwibf9o5/image/upload/v1687174468/ijfmgo5brwhwk4gue92m.jpg