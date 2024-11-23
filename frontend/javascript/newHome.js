import { reloadCSS, checkSession, getAllPosts, getAllLikes, getAllComments } from './utils.js'

export function home(container) {

    userSession = checkSession()

    if (userSession.logged == false)
        window.location.href = '/#login';

    usersPosts = getAllPosts()

    usersLikes = getAllLikes()

    usersComments = getAllComments()

    console.log(usersPosts)
    console.log(usersLikes)
    console.log(usersComments)
}