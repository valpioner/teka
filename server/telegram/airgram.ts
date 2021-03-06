import { Airgram, Auth, Chat, GetChatMessageCalendarParams, GetChatParams, 
  isError, prompt, TdJsonClient, toObject, SearchMessagesFilterInputUnion, 
  SearchMessagesFilterEmptyInput } from 'airgram';
import { UPDATE, AUTHORIZATION_STATE, MESSAGE_CONTENT, MESSAGE_CALENDAR } from '@airgram/constants'
import { ChatBaseModel, useModels, MessageBaseModel, MessageTextBaseModel } from '@airgram/use-models'

import { Store } from './Store';
import ChatModel from './ChatModel';

import * as dotenv from 'dotenv';
import MessageModel from './MessageModel';
// Load env vars
dotenv.config({ path: '../config/config.env' });

const store = new Store()

const tdJsonClient = new TdJsonClient({
  command: process.env['TDLIB_COMMAND_PATH'], //Path to the tdjson (windows) / libtdjson (unix) command.
  models: useModels({
    chat: ChatModel,
    message: MessageModel
  }),
})

const airgram = new Airgram(tdJsonClient, {
  apiId: process.env['TELEGRAM_APP_API_ID'] as unknown as number | undefined,
  apiHash: process.env['TELEGRAM_APP_API_HASH'],
  databaseDirectory: './db',
  logVerbosityLevel: 2,
  context: { $store: store }
});

// Get current User
airgram.api.getMe()
  .then(toObject) // toObject = JSON.stringify(me)
  .then((me) => {
    console.log('[API response] getMe');
  })
  .catch(console.log);

airgram.api.getChats({
  limit: 40
  // offsetChatId: 0,
  // offsetOrder: '9223372036854775807' // 2^63
}).then(({ response, $store }) => {
  console.log('[API response] getChats');
  if (isError(response)) {
    throw new Error(`[TDLib][${response.code}] ${response.message}`)
  }

  // const chats = response.chatIds.map((chatId) => {
  //   const chat = $store.chats.get(chatId)
  //   const message = $store.chatLastMessage.get(chatId)

  //   if (!chat || !message || !message.lastMessage) {
  //     throw new Error('Invalidate store')
  //   }

  //   const { lastMessage } = message
  //   const { title } = chat
  //   // const sentBy = $store.users.get(lastMessage.senderUserId)

  //   return {
  //     ...chat
  //     // chatId,
  //     // title,
  //     // lastMessage: lastMessage.content,
  //     // sentBy
  //   }
  // });

  // console.log('[api.getChats]: ', chats);
}).then(() => {
  getChat(-1001766138888)
}).then(() => {
  // getChatMessageCalendar({
  //   chatId: -1001766138888,
  //   filter: {_: 'searchMessagesFilterEmpty'}
  // } as GetChatMessageCalendarParams)
  getChatHistory(-1001766138888)
}).then(() => {
  // getChatMessageCalendar({
  //   chatId: -1001766138888,
  //   filter: {_: 'searchMessagesFilterEmpty'}
  // } as GetChatMessageCalendarParams)
  getChatHistory(-1001766138888, 4086300672)
}).catch(console.log)

// Save users to the store
airgram.on(UPDATE.updateUser, async ({ $store, update }, next) => {
  // console.log('[Update] on updateUser');
  const { user } = update
  $store.users.set(user.id, user)
  return next()
});

// Save chats to the store
airgram.on(UPDATE.updateNewChat, async ({ $store, update }, next) => {
  // console.log('[Update] on updateNewChat');
  const { chat } = update
  $store.chats.set(chat.id, chat)

  // // { chatId: -1001766138888, title: '?????????????????? ??????????????' }
  // if (chat.id === -1001766138888 && chat.title === '?????????????????? ??????????????'){
  //   getChat(chat.id);
  //   getChatHistory(chat.id);
  // }

  
  // console.log(chat.id, chat.title);
  return next()
});

// Save last messages to the store
airgram.on(UPDATE.updateChatLastMessage, async ({ $store, update }, next) => {
  // console.log('[Update] on updateChatLastMessage');
  $store.chatLastMessage.set(update.chatId, update);
  return next();
});

airgram.on(UPDATE.updateAuthorizationState, async ({ update }, next) => {
  const { authorizationState } = update;

  switch (authorizationState._) {
    case AUTHORIZATION_STATE.authorizationStateWaitPhoneNumber: {
      console.log('[Auth] WaitPhoneNumber');
      await airgram.api.setAuthenticationPhoneNumber({
        phoneNumber: process.env.TELEGRAM_APP_PHONE_NUMBER
      })
      break;
    }
    case AUTHORIZATION_STATE.authorizationStateWaitCode: {
      console.log('[Auth] WaitCode');
      await airgram.api.checkAuthenticationCode({
        code: await prompt('Please enter the secret code:\n')
      })
      break;
    }
    case AUTHORIZATION_STATE.authorizationStateReady: {
      console.log('[Auth] Success');
      return next();
    }
    default: {
      return next();
    }
  }
});

const getChat = (chatId: number) => 
  airgram.api.getChat({chatId}).then(({ response, $store }) => {
    if (isError(response)) {
      throw new Error(`[TDLib][${response.code}] ${response.message}`)
    }

    console.log('[api.getChat]: ', response);
    return response;
  }).catch(console.log);

const getChatMessageCalendar = (params: GetChatMessageCalendarParams) => 
  airgram.api.getChatMessageCalendar({
    chatId: params.chatId,
    filter: {} as SearchMessagesFilterInputUnion,
    // fromMessageId: params.fromMessageId
  } )
  .then(({ response, $store }) => {
    if (isError(response)) {
      throw new Error(`[TDLib][${response.code}] ${response.message}`)
    }

    console.log('[api.getChatMessageCalendar]: ', response);
    return response;
  }).catch(console.log);

const getChatHistory = (chatId: number, fromMessageId = 0) => 
  airgram.api.getChatHistory({
    chatId, 
    limit: 100, 
    offset: -99, 
    fromMessageId: fromMessageId})
  .then(({ response, $store }) => {
    if (isError(response)) {
      throw new Error(`[TDLib][${response.code}] ${response.message}`)
    }
  
    // if (response.messages){
      response.messages?.forEach(m => { 
        console.log('content type text? : ', m.isTextMessage);
        // if (m.content instanceof MessageTextBaseModel) {
          // let msg = {
          //   id: m.id,
          //   date: m.date,
          //   text: m.content.text.text,
          //   entities: m.content.text.entities
          // };
          console.log('content: ', m.content) 
        // };
      });
      // console.log('[api.getChatHistory]: ', response);
    // }
  }).catch(console.log);

// // Getting new messages
// airgram.on(UPDATE.updateNewMessage, async ({ $store, update }, next) => {
//   const { message } = update;
//   const chat = $store.chats.get(message.chatId)

//   if (!chat) {
//     throw new Error('Unknown chat')
//   }

//   console.log('[new message]', {
//     id: chat.id,
//     title: chat.title,
//     isBasicGroup: chat.isBasicGroup,
//     isSupergroup: chat.isSupergroup,
//     isPrivateChat: chat.isPrivateChat,
//     isSecretChat: chat.isSecretChat,
//     message: message
//   });

//   return next();
// });

// Getting all updates
// airgram.use((ctx, next) => {
//   if ('update' in ctx) {
//     console.log(`[log - all updates][${ctx._}]`, JSON.stringify(ctx.update));
//   }
//   return next();
// });


// airgram.use(new Auth({
//   phoneNumber: async () => process.env.TELEGRAM_APP_PHONE_NUMBER || prompt('Please enter your phone number:\n'),
//   code: () => prompt('Please enter the secret code:\n')
// }));

// async/await style of api requests
// void (async () => {
//   try {
//     const me = toObject(await airgram.api.getMe());
//     console.log('[Me] ', me);
//   } catch(error: any) {
//     console.error(error.message)
//   }
// })();