import * as type from './types'

export default {
  send: ({
    commit
  }) => {
    commit(type.Send)
  },
  chat: ({
    commit
  }) => {
    commit(type.Chat)
  }
}
