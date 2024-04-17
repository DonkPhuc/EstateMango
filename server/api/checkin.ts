import axios from "axios";
import { HttpStatusCode } from "axios";
const url = "http://192.168.1.217:13000/";
const path = "api/check_in_out";

export default defineEventHandler(async (event) => {
  const { token, day } = await readBody(event);
  try {
    const currentDate = new Date();
    const selectedDay = day || Math.floor(Math.random() * 31) + 1;
    currentDate.setHours(8);
    currentDate.setMinutes(27 + Math.floor(Math.random() * 4));
    currentDate.setSeconds(Math.floor(Math.random() * 60));
    currentDate.setDate(selectedDay);

    const response = await axios.post(
      `${url}${path}:create`,
      {
        user: {
          id: 17,
        },
        in: currentDate.toISOString(),
        out: null,
        createdAt: currentDate.toISOString(),
        updatedAt: currentDate.toISOString(),
        createdById: null,
        updatedById: null,
        working_hours: null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.data) {
      return {
        code: HttpStatusCode.Ok,
        data: response.data.data,
      };
    }

    return {
      code: HttpStatusCode.BadGateway,
    };
  } catch (error) {
    return {
      code: HttpStatusCode.BadRequest,
      error,
    };
  }
});
