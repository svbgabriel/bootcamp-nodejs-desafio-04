'use strict'

const User = use('App/Models/User')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, request, response }) {
    var data = request.only(['name', 'old_password', 'password'])

    const user = await User.findOrFail(auth.user.id)

    if (data.old_password) {
      const isCorrect = await Hash.verify(data.old_password, user.password)

      if (!isCorrect) {
        return response
          .status(401)
          .send({ error: { message: 'Senha incorreta' } })
      }

      if (!data.password) {
        return response
          .status(401)
          .send({ error: { message: 'Você não informou a senha nova' } })
      }

      delete data.old_password
    }

    if (!data.password) {
      delete data.password
    }

    console.log(data)

    user.merge(data)

    await user.save()

    return user
  }
}

module.exports = UserController
