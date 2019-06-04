'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const moment = require('moment')

const Event = use('App/Models/Event')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index ({ auth, request }) {
    const { page, date } = request.get()

    let query = Event.query().with('users')

    if (date) {
      query = query.whereRaw(`"date_hour"::date = ?`, date)
    }

    const events = await query.paginate(page)

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const data = request.only(['title', 'localization', 'date_hour'])

    // Verifica se já foram cadastrados outros eventos na mesma data
    const eventsCheck = await Event.query()
      .where({
        user_id: auth.user.id
      })
      .andWhere({ date_hour: data.date_hour })
      .count()

    const eventsCheckSize = eventsCheck[0]

    if (eventsCheckSize.count > 0) {
      return response.status(403).send({
        error: {
          message: 'Você já tem um evento cadastrado nessa data e horário'
        }
      })
    }

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   */
  async show ({ auth, params, response }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(403).send({
        error: { message: 'Você só pode ver seus próprios eventos' }
      })
    }

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const event = await Event.findOrFail(params.id)

    const data = request.only(['title', 'localization', 'date_hour'])

    if (event.user_id !== auth.user.id) {
      return response.status(403).send({
        error: { message: 'Você só pode editar seus próprios eventos' }
      })
    }

    const passed = moment().isAfter(event.date_hour)

    if (passed) {
      return response.status(403).send({
        error: { message: 'Você não pode editar eventos passados' }
      })
    }

    // Verifica se já foram cadastrados outros eventos na mesma data
    const eventsCheck = await Event.query()
      .where({
        user_id: auth.user.id
      })
      .andWhere({ date_hour: data.date_hour })
      .count()

    const eventsCheckSize = eventsCheck[0]

    if (eventsCheckSize.count > 0) {
      return response.status(403).send({
        error: {
          message: 'Você já tem um evento cadastrado nessa data e horário'
        }
      })
    }

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, response }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(403).send({
        error: { message: 'Você só pode remover seus próprios eventos' }
      })
    }

    const passed = moment().isAfter(event.date_hour)

    if (passed) {
      return response.status(403).send({
        error: { message: 'Você não pode remover eventos passados' }
      })
    }

    event.delete()
  }
}

module.exports = EventController
