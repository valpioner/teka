import { MESSAGE_CONTENT } from '@airgram/constants'
import { MessageBaseModel } from '@airgram/use-models'

export default class MessageModel extends MessageBaseModel {
  get isTextMessage (): boolean {
    return this.content._ === MESSAGE_CONTENT.messageText
  }
}

// tslint:disable:no-empty-interface
declare module '@airgram/core/types/outputs/Message' {
  export interface Message extends MessageModel {}
}