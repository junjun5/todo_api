import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {v4 as uuidv4 } from 'uuid';
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()
interface Task {
  id: string;
  title: string;
  timestamp: Date;
  deadline: Date;
}

const taskLists:Task[] = [
  {
    id: uuidv4(),
    title: "企画書作成",
    timestamp: new Date(2025,4,18),
    deadline: new Date(2025, 9, 20)
  },
  {
    id: uuidv4(),
    title: "チーム会議",
    timestamp: new Date(2025,4,18),
    deadline: new Date(2025, 9, 20)
  },
  {
    id: uuidv4(),
    title: "顧客へのメール送信",
    timestamp: new Date(2025,4,18),
    deadline: new Date(2025, 9, 20)
  }
]
app.use("*", prettyJSON());

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.post('/create', async (c) => {
  const {title,deadline} = await c.req.json<{
    title: string
    deadline: Date
  }>();
  const tasksMaxNum = taskLists.length
  const now = new Date();
  const newTask:Task = { 
    id : tasksMaxNum+1 , 
    title : "taskName",
    timestamp: new Date(),
    deadline: new Date(2025, 9, 20)
  }
  taskLists.push(newTask);
  // return c.text(String(tasksMaxNum))
  console.log(title, deadline)
  return c.json(taskLists)
})
app.get('/read', (c) => c.json({tasks: taskLists}));
app.get('/update', (c) => {
  return c.text('Hello Hono!')
})
app.get('/delete', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
