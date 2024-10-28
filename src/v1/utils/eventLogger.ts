import { EventLog } from "./dto";

const eventsLogs: EventLog[] = [];

export const addLog = (action: string, productId: string, details: object) => {
  eventsLogs.push({
    action,
    productId,
    details,
    timestamp: new Date(),
  });
};

export const getLogs = () => {
  return eventsLogs;
};
