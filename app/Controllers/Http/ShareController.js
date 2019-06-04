'use strict'

const Event = use('App/Models/Event')
const Job = use('App/Jobs/NewEventMail')
const Kue = use('Kue')

class ShareController {
  async store ({ auth, request, params, response }) {
    const event = await Event.findOrFail(params.id)

    const email = request.input('email')

    if (event.user_id !== auth.user.id) {
      return response
        .status(403)
        .send({ error: { message: 'Você só pode compartilhar eventos seus' } })
    }

    Kue.dispatch(Job.key, { email, event }, { attempts: 3 })
  }
}

module.exports = ShareController
