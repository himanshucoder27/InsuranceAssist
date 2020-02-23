class User {
    constructor(name, age, contact, email, picture, id) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.contact = contact;
        this.email = email;
        this.picture = picture;
        this.policies = [];
    }
}

module.exports.User = User;
