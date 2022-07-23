import * as express from 'express'


async function main() {
    const app = express()

    const port = process.env.PORT || 3030
    app.listen(port, () => {
        console.log(`server started on port ${port}`)
    })
}

main()
