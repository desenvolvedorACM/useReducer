export const SighIn = (email: string, password: string) => {
    console.log(email, password);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email == 'root' && password == 'root') {
                resolve('isLoggedIn');
            } else {
                // throw new Error('Incorrect username or password');
                reject('Incorrect username or password')
            }
        }, 2000);

    })
}