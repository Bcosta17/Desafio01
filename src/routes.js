import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

const date = new Date(Date.now())
const today = date.toLocaleDateString()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
           

            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
    
      }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
        
            const {tittle, description} = req.body
            
            if(!tittle) {
                return res.writeHead(422).end('O título é Obrigatório')
            }
           
            if(!description) {
                return res.writeHead(422).end('A descrição é Obrigatório')
            }

            const task = {
              id: randomUUID(),
              tittle,
              description,
              completed_at: null,
              created_at: today,
              update_at: null,
             }
            
             database.insert('tasks', task)
        
             return res.writeHead(201).end()
        }     
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const {tittle, description} = req.body
            
            
            if (!tittle && !description) {

                return res.writeHead(422).end('Envie pelo menos uma informação para ser atualizada!')
            
            }

            const data = database.getById('tasks', id)

            if (!data) {
                return res.writeHead(404).end('Tarefa não localizada!')
            }

            database.update('tasks', id, {
                tittle: tittle ?? data.tittle,
                description: description ?? data.description,
                created_at: data.created_at,
                completed_at:data.completed_at,
                update_at: today,
            })

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
        
            const { id } = req.params

            const data = database.getById('tasks', id)

            if (!data) {
                return res.writeHead(404).end('Tarefa não localizada!')
            }

            database.update('tasks', id, {
                tittle: data.tittle,
                description: data.description,
                created_at: data.created_at,
                completed_at:today,
                update_at: today,
            })

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end();
        }
    }
]