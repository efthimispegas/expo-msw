import { rest } from 'msw'
import { shuffleList } from "./utils";
import fakeDataItems from "./fakeData";

/**
 * mock api handler
 */
const handlers = [

  rest.get(
      `${process.env.EXPO_PUBLIC_BASE_URL}`, (req, res, ctx) => {

        const paramTake = req.url.searchParams.get("take");

        // console.log("param received is : ", paramTake);

        const shuffledList: Array<any> = shuffleList(fakeDataItems as []);

        let finalList: Array<any> = shuffledList.slice(0, Number(paramTake));

        const responseBody = {
          results: finalList
        }

        // console.log("response is: ", responseBody);

        ctx.status(200);
        ctx.delay(2000);
        const response = ctx.json(responseBody);


        return res(response)
      }
  )
]

export { handlers }
