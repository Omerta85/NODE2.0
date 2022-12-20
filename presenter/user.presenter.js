
    const normalize = (user) =>{
        user= user.toJSON();
        const arr = [
            'password',
            '__v',
        ];
        arr.forEach(field=>{
            delete user[field];
        })
        return user;
    };
    const normalizeMany = (users) =>{
        users.map(user => normalize(user))
    }
    module.exports = {
    normalize,
        normalizeMany
    }