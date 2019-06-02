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
    const data = request.only(['name', 'old_password', 'new_password'])

    const user = await User.findOrFail(auth.user.id)

    const isCorrect = await Hash.verify(data.old_password, user.password)

    if (!isCorrect) {
      return response
        .status(401)
        .send({ error: { message: 'Senha incorreta' } })
    }

    user.merge({ name: data.name, password: data.new_password })

    await user.save()

    return user
  }
}

module.exports = UserController
