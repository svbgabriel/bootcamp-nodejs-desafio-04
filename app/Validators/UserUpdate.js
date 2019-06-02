'use strict'

class UserUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      new_password: 'confirmed'
    }
  }
}

module.exports = UserUpdate
