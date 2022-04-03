// import { Airgram, Auth, isError, prompt, toObject } from 'airgram';
import { Airgram, Auth, isError, prompt, toObject } from 'airgram';
import { UPDATE, AUTHORIZATION_STATE } from '@airgram/constants'

import dotenv from 'dotenv';
// Load env vars
dotenv.config({ path: '../config/config.env' });

const airgram = new Airgram({
  apiId: process.env['TELEGRAM_APP_API_ID'], //as number | undefined,
  apiHash: process.env['TELEGRAM_APP_API_HASH'],
  command: process.env['TDLIB_COMMAND_PATH'], //Path to the tdjson (windows) / libtdjson (unix) command.
  // command: './tdlib/tdjson.dll',
  databaseDirectory: './db',
  logVerbosityLevel: 2
});

// airgram.use(new Auth({
//   code: () => prompt('Please enter the secret code:\n'),
//   phoneNumber: () => prompt('Please enter your phone number:\n')
// }));

// async/await style of requests
void (async () => {
  try {
    const me = toObject(await airgram.api.getMe());
    console.log('[Me] ', me);
  } catch(error) {
    console.error(error.message)
  }

  const {response: chats} = await airgram.api.getChats({
    limit: 105,
    offsetChatId: 0,
    offsetOrder: '9223372036854775807'
  })
  console.log('[My chats] ', chats);
})();

// Example above is equivalent to:
// airgram.api.getMe().then(toObject).then((me) => {
//   writeLog(`[Me] `, me)
// })

// handle errors
// airgram.api.setProfilePhoto({
//   photo: {
//     _: 'inputFileLocal',
//     path: '/invalid/path/to/image.jpg'
//   }
// }).then(({ request, response }) => {
//   if (isError(response)) {
//     writeError(`[${request.method}][${response.code}] ${response.message}`);
//   } else {
//     writeInfo('Profile photo has been loaded.');
//   }
// });

// Getting all updates
// airgram.use((ctx, next) => {
//   if ('update' in ctx) {
//     console.log(`[log - all updates][${ctx._}]`, JSON.stringify(ctx.update));
//   }
//   return next();
// });

// Getting new messages
airgram.on(UPDATE.updateNewMessage, async ({ update }, next) => {
  const { message } = update;
  console.log('[log - new message]', message);
  return next();
});