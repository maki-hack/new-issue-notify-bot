import * as express from 'express'
import * as line from '@line/bot-sdk'
require('dotenv').config()

async function main() {
    try {

        const app = express()

        const lineClientConfig = {
            channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
            channelSecret: process.env.LINE_CHANNEL_SECRET!
        }

        const lineClient = new line.Client(lineClientConfig)

        app.post('/callback', line.middleware(lineClientConfig), async (req, res) => {
            const events: line.WebhookEvent[] = req.body['events'] || []

            const event = events[0]

            console.log(event)

            if (event.type === 'message') {
                await lineClient.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Hello, world!'
                })
                
                res.status(200).json({
                    status: 'success'
                })

                return
            } else {
                res.status(500).json({
                    status: 'error'
                })
                return
            }

        })
        
        // サーバーを起動
        const port = process.env.PORT || 3030
        app.listen(port, () => {
            console.log(`server started on port ${port}`)
        })

    } catch (e) {
        console.error(e)
    }
}

main()
