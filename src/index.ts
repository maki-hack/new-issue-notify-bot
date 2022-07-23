import * as express from "express";
import * as line from "@line/bot-sdk";
import { RakutenBooksAPI } from "./rakuten";
require("dotenv").config();

async function main() {
  try {
    const app = express();

    const lineClientConfig = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
      channelSecret: process.env.LINE_CHANNEL_SECRET!,
    };

    const lineClient = new line.Client(lineClientConfig);
    const rakutenBooksAPI = new RakutenBooksAPI(process.env.RAKUTEN_APP_ID!);

    app.post(
      "/callback",
      line.middleware(lineClientConfig),
      async (req, res) => {
        const events: line.WebhookEvent[] = req.body["events"] || [];

        if (!!events.length) {
          const event = events[0];

          console.log(event);

          if (event.type === "message") {
            let replyText = "正しいコマンドを入力してください";

            if (event.message.type === "text") {
              const { text } = event.message;
              if (text.trim().endsWith("の発売日を教えて")) {
                const match = text.match(/(.*)の発売日を教えて$/);
                if (match) {
                  const title = match[1];

                  const books = await rakutenBooksAPI.searchBook({
                    title,
                    sort: "-releaseDate",
                  });

                  if (!books.length) {
                    replyText = "対象の書籍が見つかりませんでした";
                  } else {
                    const latest = books[0];
                    replyText = `${latest.title}の発売日は${latest.salesDate}です`;
                  }

                  console.log(
                    books.map((b) => ({
                      title: b.title,
                      salesDate: b.salesDate,
                    }))
                  );
                }
              }
            }

            await lineClient.replyMessage(event.replyToken, {
              type: "text",
              text: replyText,
            });
          }
        }

        res.status(200).json({
          status: "success",
        });

        return;
      }
    );

    // サーバーを起動
    const port = process.env.PORT || 3030;
    app.listen(port, () => {
      console.log(`server started on port ${port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

main();
