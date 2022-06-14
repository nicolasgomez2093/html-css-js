const API_URL = `https://api.github.com/users/`

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

const toasts = document.getElementById('toasts')

async function getUser(username) {
    try{
        const {data} = await axios(API_URL + username)

        createUserCard(data)
        getRepos(username)
        createNotification('Usuario encontrado con exito!')
    }catch(err) {
        if(err.response.status == 404){
            createErrorCard('No profile with this username')
            createNotification('Usuario no encontrado!')
        }
    }
}

async function getRepos(username){
    try{
        const {data} = await axios(API_URL + username + '/repos?sort=created')

        addReposToCard(data)
    }catch(err){
        createErrorCard('Problem fetching repos')
    }
}

function createUserCard(user) {
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
    <div class="">
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
        <h2>${userID}</h2>
        ${userBio}
        <ul>
            
            <li>${user.followers}<strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
        </ul>

        <div class="" id="repos"></div>
    </div>
    </div>
    `

    main.innerHTML = cardHTML
}

function createErrorCard(msg){
    const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos){
    const reposEl = document.getElementById('repos')

    repos
        .slice(0,5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

function createNotification(msg){
    const notif = document.createElement('div')
    notif.classList.add('toast')

    notif.innerText = msg

    toasts.appendChild(notif)

    setTimeout(() =>{
        notif.remove()
    }, 3000)
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)
        search.value = ''
    }
})