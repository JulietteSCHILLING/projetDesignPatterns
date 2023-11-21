export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Vérifie si le nom du cookie correspond à celui recherché
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1); // Renvoie la valeur du cookie
        }
    }
    return null; // Renvoie null si le cookie n'est pas trouvé
}

export function supprimerCookie(nomCookie) {
    document.cookie = nomCookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
