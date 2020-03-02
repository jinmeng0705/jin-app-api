const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  console.log(`Request received as email ${email}, name ${name}, passworkd as ${password}`);
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      // .returning('email') // not work with MySQL
      .then(() => {
        return trx('users')
          //.returning('*')
          .insert({
            email: email,
            name: name,
            joined: new Date()
          })
        // .then(user => {
        //   res.json(user[0]);
        // })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json(`unable to register: ${err}`))

  console.log(`Register user ${name} successfully`);

  var response;
  db.from('users').select('*')
    .where('email', '=', email)
    .then((rows) => {
      for (row of rows) {
        response = res.json(row);
      }
    }
    )

  return response;

}
//     db.transaction(trx => {
//       trx.insert({
//         hash: hash,
//         email: email
//       })
//       .into('login')
//       .returning('email')
//       .then(loginEmail => {
//         return trx('users')
//           .returning('*')
//           .insert({
//             email: loginEmail[0],
//             name: name,
//             joined: new Date()
//           })
//           .then(user => {
//             res.json(user[0]);
//           })
//       })
//       .then(trx.commit)
//       .catch(trx.rollback)
//     })
//     .catch(err => res.status(400).json(`unable to register: ${err}`))
// }

module.exports = {
  handleRegister: handleRegister
};
