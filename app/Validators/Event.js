'use strict'

const Antl = use('Antl')

class Event {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      localization: 'required',
      date_hour: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Event
