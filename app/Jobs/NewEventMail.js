'use strict'

const Mail = use('Mail')

class NewEventMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewEventMail-job'
  }

  // This is where the work is done.
  async handle ({ email, event }) {
    console.log(`Job: ${NewEventMail.key}`)

    await Mail.send(
      ['emails.event_share'],
      {
        event
      },
      message => {
        message
          .to(email)
          .from('svbgabriel@gmail.com', 'Gabriel Batista')
          .subject('Um novo evento para você')
      }
    )
  }
}

module.exports = NewEventMail
