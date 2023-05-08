import { subDays, subHours, subMinutes } from 'date-fns';
import { createResourceId } from '../utils/create-resource-id';
import { deepCopy } from '../utils/deep-copy';

const now = new Date();

const contacts = [
  {
    id: 'gabrielaId',
    avatar: '',
    isActive: false,
    lastActivity: 'Escribe un mensaje en inglés. Gabriela responderá con el texto corregido, una calificación y sugerencias para mejorar.',
    name: 'Gabriela',
    mode: 'Corrección de textos',
    instructions: 'Escribe un mensaje en inglés. Gabriela responderá con el texto corregido, una calificación y sugerencias para mejorar.',
    isBot: true
  },
];

let threads = [
  {
    id: '5e867eb9de721aecaccf4f7b',
    messages: [
      {
        id: '5e867f167d5f78109ae9f2a4',
        attachments: [],
        body: 'hi nice to meet you my dear mexican friend how you today',
        contentType: 'text',
        createdAt: subDays(subHours(now, 2), 4).getTime(),
        authorId: '5e86809283e28b96d2d38537',
        isBot: false
      },
      {
        id: '5e867f0a5bc0ff2bfa07bfa6',
        attachments: [],
        body: `
          Corrección: \n
          Hi, nice to meet you, my dear Mexican friend. How are you today? \n 
          
          Calificación: 75 \n

          Sugerencias para mejorar el uso del inglés: \n
          
          Utiliza comas para separar frases o elementos en una oración. \n
          Asegúrate de utilizar las palabras apropiadas, como "are" en lugar de "you" para preguntar cómo se encuentra alguien. \n
          Considera la capitalización adecuada al comienzo de una oración o al usar pronombres personales. \n
          Mantén un espacio adecuado entre las palabras.
        `,
        score: 75,
        textCorrection: 'Hi, nice to meet you, my dear Mexican friend. How are you today?',
        suggestions: [
          'Utiliza comas para separar frases o elementos en una oración.',
          'Asegúrate de utilizar las palabras apropiadas, como "are" en lugar de "you" para preguntar cómo se encuentra alguien.',
          'Considera la capitalización adecuada al comienzo de una oración o al usar pronombres personales.',
          'Mantén un espacio adecuado entre las palabras.'
        ],
        contentType: 'text',
        createdAt: subDays(subHours(now, 10), 4).getTime(),
        authorId: 'gabrielaId',
        isBot: true
      },
    ],
    participantIds: [
      'gabrielaId',
      '5e86809283e28b96d2d38537'
    ],
    type: 'ONE_TO_ONE',
    unreadCount: 0
  },
];

const findThreadById = (threadId) => {
  return threads.find((_threadId) => _threadId.id === threadId);
};

const findThreadByParticipantIds = (participantIds) => {
  const thread = threads.find((_thread) => {
    if (_thread.participantIds.length !== participantIds.length) {
      return false;
    }

    const foundParticipantIds = new Set();

    _thread.participantIds.forEach((participantId) => {
      if (participantIds.includes(participantId)) {
        foundParticipantIds.add(participantId);
      }
    });

    return foundParticipantIds.size === participantIds.length;
  });

  return thread;
};

class ChatApi {
  getContacts(request) {
    const { query } = request;

    return new Promise((resolve, reject) => {
      try {
        let foundContacts = contacts;

        if (query) {
          const cleanQuery = query.toLowerCase().trim();
          foundContacts =
            foundContacts.filter((contact) => (contact.name.toLowerCase().includes(cleanQuery)));
        }

        resolve(deepCopy(foundContacts));
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  getThreads(request) {
    // On server get current identity (user) from the request
    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '',
      name: 'Usuario'
    };

    const expandedThreads = threads.map((thread) => {
      const participants = [user];

      contacts.forEach((contact) => {
        if (thread.participantIds.includes(contact.id)) {
          participants.push({
            id: contact.id,
            avatar: contact.avatar,
            lastActivity: contact.lastActivity,
            name: contact.name
          });
        }
      });

      return {
        ...thread,
        participants
      };
    });

    return Promise.resolve(deepCopy(expandedThreads));
  }

  getThread(request) {
    const { threadKey } = request;

    return new Promise((resolve, reject) => {
      if (!threadKey) {
        reject(new Error('Thread key is required'));
        return;
      }

      try {
        // On server get current identity (user) from the request
        const user = {
          id: '5e86809283e28b96d2d38537',
          avatar: '',
          name: 'Usuario'
        };

        let thread;

        // Thread key might be a contact ID
        const contact = contacts.find((contact) => contact.id === threadKey);

        if (contact) {
          thread = findThreadByParticipantIds([user.id, contact.id]);
        }

        // Thread key might be a thread ID
        if (!thread) {
          thread = findThreadById(threadKey);
        }

        // If reached this point and thread does not exist this could mean:
        // b) The thread key is a contact ID, but no thread found
        // a) The thread key is a thread ID and is invalid
        if (!thread) {
          return resolve(null);
        }

        const participants = [user];

        contacts.forEach((contact) => {
          if (thread.participantIds.includes(contact.id)) {
            participants.push({
              id: contact.id,
              avatar: contact.avatar,
              lastActivity: contact.lastActivity,
              name: contact.name
            });
          }
        });

        const expandedThread = {
          ...thread,
          participants
        };

        resolve(deepCopy(expandedThread));
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  markThreadAsSeen(request) {
    const { threadId } = request;

    return new Promise((resolve, reject) => {
      try {
        const thread = threads.find((_thread) => _thread.id === threadId);

        if (thread) {
          thread.unreadCount = 0;
        }

        resolve(true);
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  getParticipants(request) {
    const { threadKey } = request;

    return new Promise((resolve, reject) => {
      try {
        // On server get current identity (user) from the request
        const user = {
          id: '5e86809283e28b96d2d38537',
          avatar: '',
          name: 'Usuario'
        };

        let participants = [user];

        // Thread key might be a thread ID
        let thread = findThreadById(threadKey);

        if (thread) {
          contacts.forEach((contact) => {
            if (thread.participantIds.includes(contact.id)) {
              participants.push({
                id: contact.id,
                avatar: contact.avatar,
                lastActivity: contact.lastActivity,
                name: contact.name
              });
            }
          });
        } else {
          const contact = contacts.find((contact) => contact.id === threadKey);

          // If no contact found, the user is trying a shady route
          if (!contact) {
            reject(new Error('Unable to find the contact'));
            return;
          }

          participants.push({
            id: contact.id,
            avatar: contact.avatar,
            lastActivity: contact.lastActivity,
            name: contact.name
          });
        }

        return resolve(participants);
      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addMessage(request) {
    const { threadId, recipientIds, body } = request;

    return new Promise(async (resolve, reject) => {
      try {
        if (!(threadId || recipientIds)) {
          reject(new Error('Thread ID or recipient IDs has to be provided'));
          return;
        }

        // On server get current identity (user) from the request
        const user = {
          id: '5e86809283e28b96d2d38537'
        };

        let thread;

        // Try to find the thread
        if (threadId) {
          thread = findThreadById(threadId);

          // If thread ID provided the thread has to exist.

          if (!thread) {
            reject(new Error('Invalid thread id'));
            return;
          }
        } else {
          const participantIds = [user.id, ...(recipientIds || [])];
          thread = findThreadByParticipantIds(participantIds);
        }

        // If reached this point, thread will exist if thread ID provided
        // For recipient Ids it may or may not exist. If it doesn't, create a new one.

        if (!thread) {
          const participantIds = [user.id, ...(recipientIds || [])];

          thread = {
            id: createResourceId(),
            messages: [],
            participantIds,
            type: participantIds.length === 2 ? 'ONE_TO_ONE' : 'GROUP',
            unreadCount: 0
          };

          // Add the new thread to the DB
          threads.push(thread);
        }

        const message = {
          id: createResourceId(),
          attachments: [],
          body,
          contentType: 'text',
          createdAt: new Date().getTime(),
          authorId: user.id
        };

        thread.messages.push(message);

        // Realizar peticion POST  a la API de GPT-3. Como prompt debe pasarse que debe corregir el texto del body, se le debe asignar una calificacion a la respuesta entre 1 y 100, Debe responder con sugerencias para mejorar el uso del ingles 

        const GPT_KEY = process.env.NEXT_PUBLIC_GPT_KEY

        // Se debe crear un prompt con el texto a corregir, las sugerencias y la calificacion. Se debe colocar de tal forma que podamos saber cada parte del prompt para poder extraer la informacion de la respuesta
        const bodyPrompt = `
        As a professional English teacher, please correct the following text, provide a score between 1 and 100 without '/100', and give suggestions to improve the use of English:
        ${body}
        [CORRECTED_TEXT_STARTS]Corrected Text:[CORRECTED_TEXT_ENDS]
        [SCORE_STARTS]Score:[SCORE_ENDS]
        [SUGGESTIONS_STARTS]Suggestions:
        1.
        2.
        3.
        [SUGGESTIONS_ENDS]
        `
        const request = {
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "assistant", "content": bodyPrompt }],
          "temperature": 0.7
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GPT_KEY}`
          },
          body: JSON.stringify(request)
        })

        const data = await response.json()

        console.log('data', data)
        
        const responseText = data.choices[0].message.content;

        // Separa la respuesta en líneas y extrae las partes relevantes
        const lines = responseText.trim().split('\n');
        const correctedText = lines[0].substring("Corrected Text: ".length);
        const score = parseInt(lines[2].substring("Score: ".length), 10);
        // Suggestions se encuentran despues de la linea "Suggestions: " y hay una por cada linea hasta el final
        const suggestionsLength = lines.length - 5;
        const suggestions = lines.slice(5, 5 + suggestionsLength);

        console.log('correctedText', correctedText)
        console.log('score', score)
        console.log('suggestions', suggestions)

        const message2 = {
          id: createResourceId(),
          attachments: [],
          body: data.choices[0].message.content,
          contentType: 'text',
          createdAt: new Date().getTime(),
          authorId: 'gabrielaId',
          score: score,
          textCorrection: correctedText,
          suggestions: suggestions,
          isBot: true
        };

        console.log('message2', message2)

        thread.messages.push(message2);

        console.log('thread', thread);

        resolve({
          threadId: thread.id,
          message: message2
        });

      } catch (err) {
        console.error('[Chat Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const chatApi = new ChatApi();
