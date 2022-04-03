import { ChatUnion, UpdateChatLastMessage, UserUnion } from 'airgram'

export class Store {
  public readonly chats: Map<number, ChatUnion> = new Map()

  public readonly chatLastMessage: Map<number, UpdateChatLastMessage> = new Map()

  public readonly users: Map<number, UserUnion> = new Map()
}

declare module '@airgram/core/types/airgram' {
  interface ApiResponse<ParamsT, ResultT> {
    $store: Store
  }

  interface UpdateContext<UpdateT> {
    $store: Store
  }
}

// { chatId: -1001198299024, title: 'Верховна Рада України' },
// { chatId: -1001296487842, title: 'Оперативний ЗСУ' },
// { chatId: -1001152058353, title: 'ДСНС України' },
// { chatId: -1001734296280, title: 'Беларускі Гаюн' },
// { chatId: -1001162418695, title: 'Слуга Народу' },
// { chatId: -1001124038902, title: 'Varlamov News' },
// { chatId: -1001297348512, title: 'Команда Зеленського' },
// { chatId: -1001745568139, title: 'The Люди. Лядов' },
// { chatId: -1001271343429, title: 'Ateo Breaking' },
// { chatId: -1001792312281, title: 'Генеральний штаб ЗСУ' },
// { chatId: -1001483183478, title: 'Ateo Blacked' },
// { chatId: -1001231519967, title: 'НЕВЗОРОВ' },
// { chatId: -1001713072725, title: 'Галицька броня' },
// { chatId: -1001463721328, title: 'Zelenskiy / Official' },
// { chatId: -1001766138888, title: 'Повітряна Тривога' },
// { chatId: -1001682216432, title: 'Сухопутні війська ЗС України / Land Forces of Ukraine 🇺🇦' },
// { chatId: -1001368563607, title: '🇺🇦 Максим Козицький/Львівська ОВА (ОДА)' },
// { chatId: -1001130766059, title: 'Навальный LIVE' },
// { chatId: -1001601423054, title: 'IT ARMY of Ukraine' },
// { chatId: -1001296224042, title: 'Служба безпеки України' },
// { chatId: -1001399934598, title: 'Оповіщення ЦЗ' },
// { chatId: -1001199493204, title: 'Андрій Садовий' },
// { chatId: -1001327963685, title: 'Mikheil Saakashvili' },
// { chatId: -1001461601136, title: 'СихівМедіа' },
// { chatId: -1001351029634, title: 'Дудь' },