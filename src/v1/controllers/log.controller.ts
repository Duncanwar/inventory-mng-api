import { getLogs } from "../utils/eventLogger";
import catchAsync from "../utils/catchAsync";

export default class EventLoggerController {
  static getLogs = catchAsync(async (req, res) => {
    const logs = getLogs();
    return res
      .status(200)
      .json({ message: "Event Logs Retrieved", data: logs });
  });
}
