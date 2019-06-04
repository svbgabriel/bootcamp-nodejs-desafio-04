'use strict'

class UserUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      password: 'confirmed'
    }
  }
}

module.exports = UserUpdate
